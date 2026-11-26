'use strict';

/**
 * Trình biên dịch & kiểm thử tự động cho nhân lõi s4-core.wasm
 * Xuất ra d:\LinguaPath\assets\s4-core.wasm khớp 100% ABI của rust-core/src/lib.rs (#![no_std]).
 * Chạy: node rust-core/build-wasm.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const OUT_WASM = path.resolve(__dirname, '..', 'assets', 's4-core.wasm');

const I32 = 0x7f;
const I64 = 0x7e;
const F32 = 0x7d;
const F64 = 0x7c;
const VOID = 0x40;

const OP = {
  unreachable: 0x00,
  nop: 0x01,
  block: 0x02,
  loop: 0x03,
  if: 0x04,
  else: 0x05,
  end: 0x0b,
  br: 0x0c,
  br_if: 0x0d,
  ret: 0x0f,
  call: 0x10,
  drop: 0x1a,
  select: 0x1b,
  local_get: 0x20,
  local_set: 0x21,
  local_tee: 0x22,
  global_get: 0x23,
  global_set: 0x24,
  i32_load: 0x28,
  f32_load: 0x2a,
  i32_load16_u: 0x2f,
  i32_store: 0x36,
  f32_store: 0x38,
  i32_store16: 0x3b,
  memory_size: 0x3f,
  memory_grow: 0x40,
  i32_const: 0x41,
  i64_const: 0x42,
  f32_const: 0x43,
  f64_const: 0x44,
  i32_eqz: 0x45,
  i32_eq: 0x46,
  i32_ne: 0x47,
  i32_lt_s: 0x48,
  i32_lt_u: 0x49,
  i32_gt_s: 0x4a,
  i32_gt_u: 0x4b,
  i32_le_s: 0x4c,
  i32_le_u: 0x4d,
  i32_ge_s: 0x4e,
  i32_ge_u: 0x4f,
  f32_eq: 0x5b,
  f32_ne: 0x5c,
  f32_lt: 0x5d,
  f32_gt: 0x5e,
  f32_le: 0x5f,
  f32_ge: 0x60,
  f64_eq: 0x61,
  f64_lt: 0x63,
  f64_gt: 0x64,
  f64_le: 0x65,
  f64_ge: 0x66,
  i32_add: 0x6a,
  i32_sub: 0x6b,
  i32_mul: 0x6c,
  i32_div_s: 0x6d,
  i32_div_u: 0x6e,
  i32_rem_s: 0x6f,
  i32_and: 0x71,
  i32_or: 0x72,
  i32_xor: 0x73,
  i32_shl: 0x74,
  i32_shr_s: 0x75,
  i32_shr_u: 0x76,
  i64_add: 0x7c,
  i64_and: 0x83,
  i64_or: 0x84,
  i64_shl: 0x86,
  i64_shr_u: 0x88,
  f32_abs: 0x8b,
  f32_neg: 0x8c,
  f32_ceil: 0x8d,
  f32_floor: 0x8e,
  f32_sqrt: 0x91,
  f32_add: 0x92,
  f32_sub: 0x93,
  f32_mul: 0x94,
  f32_div: 0x95,
  f32_min: 0x96,
  f32_max: 0x97,
  f64_abs: 0x99,
  f64_neg: 0x9a,
  f64_sqrt: 0x9f,
  f64_add: 0xa0,
  f64_sub: 0xa1,
  f64_mul: 0xa2,
  f64_div: 0xa3,
  f64_min: 0xa4,
  f64_max: 0xa5,
  i32_wrap_i64: 0xa7,
  i32_trunc_f32_s: 0xa8,
  i32_trunc_f64_s: 0xaa,
  i64_extend_i32_s: 0xac,
  i64_extend_i32_u: 0xad,
  f32_convert_i32_s: 0xb2,
  f32_demote_f64: 0xb6,
  f64_convert_i32_s: 0xb7,
  f64_promote_f32: 0xbb,
  i64_reinterpret_f64: 0xbd,
  f64_reinterpret_i64: 0xbf
};

function encodeUleb(val) {
  const out = [];
  let v = val >>> 0;
  do {
    let b = v & 0x7f;
    v >>>= 7;
    if (v !== 0) b |= 0x80;
    out.push(b);
  } while (v !== 0);
  return out;
}

function encodeSleb(val) {
  const out = [];
  let v = BigInt(val);
  while (true) {
    const b = Number(v & 0x7fn);
    v >>= 7n;
    const signBit = (b & 0x40) !== 0;
    if ((v === 0n && !signBit) || (v === -1n && signBit)) {
      out.push(b);
      break;
    }
    out.push(b | 0x80);
  }
  return out;
}

function f32Bytes(v) {
  const buf = Buffer.allocUnsafe(4);
  buf.writeFloatLE(v, 0);
  return Array.from(buf);
}

function f64Bytes(v) {
  const buf = Buffer.allocUnsafe(8);
  buf.writeDoubleLE(v, 0);
  return Array.from(buf);
}

function encodeStr(s) {
  const b = Buffer.from(s, 'utf8');
  return [...encodeUleb(b.length), ...b];
}

function encodeVec(items) {
  const out = [...encodeUleb(items.length)];
  for (const it of items) out.push(...it);
  return out;
}

function section(id, payload) {
  return [id, ...encodeUleb(payload.length), ...payload];
}

class FuncBuilder {
  constructor(params, results) {
    this.params = params;
    this.results = results;
    this.locals = [];
    this.localMap = new Map();
    this.nextLocal = params.length;
    this.code = [];
  }

  param(idx) {
    return idx;
  }

  local(type, name) {
    if (name && this.localMap.has(name)) return this.localMap.get(name);
    const idx = this.nextLocal++;
    this.locals.push(type);
    if (name) this.localMap.set(name, idx);
    return idx;
  }

  emit(...bytes) {
    for (const b of bytes) this.code.push(b & 0xff);
    return this;
  }

  op(code) { this.code.push(code); return this; }
  i32(v) { this.code.push(OP.i32_const, ...encodeSleb(v)); return this; }
  i64(v) { this.code.push(OP.i64_const, ...encodeSleb(v)); return this; }
  f32(v) { this.code.push(OP.f32_const, ...f32Bytes(v)); return this; }
  f64(v) { this.code.push(OP.f64_const, ...f64Bytes(v)); return this; }

  get(idx) { this.code.push(OP.local_get, ...encodeUleb(idx)); return this; }
  set(idx) { this.code.push(OP.local_set, ...encodeUleb(idx)); return this; }
  tee(idx) { this.code.push(OP.local_tee, ...encodeUleb(idx)); return this; }
  gget(idx) { this.code.push(OP.global_get, ...encodeUleb(idx)); return this; }
  gset(idx) { this.code.push(OP.global_set, ...encodeUleb(idx)); return this; }

  call(fnIdx) { this.code.push(OP.call, ...encodeUleb(fnIdx)); return this; }
  br(depth) { this.code.push(OP.br, ...encodeUleb(depth)); return this; }
  brIf(depth) { this.code.push(OP.br_if, ...encodeUleb(depth)); return this; }

  loadI32(offset = 0) { this.code.push(OP.i32_load, ...encodeUleb(2), ...encodeUleb(offset)); return this; }
  storeI32(offset = 0) { this.code.push(OP.i32_store, ...encodeUleb(2), ...encodeUleb(offset)); return this; }
  loadF32(offset = 0) { this.code.push(OP.f32_load, ...encodeUleb(2), ...encodeUleb(offset)); return this; }
  storeF32(offset = 0) { this.code.push(OP.f32_store, ...encodeUleb(2), ...encodeUleb(offset)); return this; }
  loadU16(offset = 0) { this.code.push(OP.i32_load16_u, ...encodeUleb(1), ...encodeUleb(offset)); return this; }
  storeU16(offset = 0) { this.code.push(OP.i32_store16, ...encodeUleb(1), ...encodeUleb(offset)); return this; }

  block(fn, bt = VOID) {
    this.code.push(OP.block, bt);
    fn();
    this.code.push(OP.end);
    return this;
  }

  loop(fn, bt = VOID) {
    this.code.push(OP.loop, bt);
    fn();
    this.code.push(OP.end);
    return this;
  }

  if_(thenFn, elseFn = null, bt = VOID) {
    this.code.push(OP.if, bt);
    thenFn();
    if (elseFn) {
      this.code.push(OP.else);
      elseFn();
    }
    this.code.push(OP.end);
    return this;
  }

  whileLoop(condFn, bodyFn) {
    // block { loop { !cond -> br 1; body; br 0 } }
    this.block(() => {
      this.loop(() => {
        condFn();
        this.op(OP.i32_eqz).brIf(1);
        bodyFn();
        this.br(0);
      });
    });
    return this;
  }

  encodeBody() {
    // Run-length encode local declarations
    const runs = [];
    for (const t of this.locals) {
      if (runs.length && runs[runs.length - 1].type === t) {
        runs[runs.length - 1].count++;
      } else {
        runs.push({ count: 1, type: t });
      }
    }
    const body = [...encodeVec(runs.map((r) => [...encodeUleb(r.count), r.type])), ...this.code, OP.end];
    return [...encodeUleb(body.length), ...body];
  }
}

class ModuleBuilder {
  constructor() {
    this.types = [];
    this.funcs = [];
    this.exports = [];
  }

  internType(params, results) {
    const key = `${params.join(',')}=>${results.join(',')}`;
    let idx = this.types.findIndex((t) => t.key === key);
    if (idx === -1) {
      idx = this.types.length;
      this.types.push({ key, params, results });
    }
    return idx;
  }

  addFunc(name, params, results, buildFn, exportName = null) {
    const idx = this.funcs.length;
    const typeIdx = this.internType(params, results);
    const fb = new FuncBuilder(params, results);
    this.funcs.push({ name, idx, typeIdx, fb, buildFn });
    if (exportName) {
      this.exports.push({ name: exportName, kind: 0x00, idx });
    }
    return idx;
  }

  build() {
    for (const f of this.funcs) {
      f.buildFn(f.fb);
    }

    const typeSec = section(
      1,
      encodeVec(
        this.types.map((t) => [
          0x60,
          ...encodeVec(t.params.map((p) => [p])),
          ...encodeVec(t.results.map((r) => [r]))
        ])
      )
    );

    const funcSec = section(3, encodeVec(this.funcs.map((f) => encodeUleb(f.typeIdx))));

    // Memory: min 16 pages (1 MB), max 512 pages (32 MB)
    const memSec = section(5, encodeVec([[0x01, ...encodeUleb(16), ...encodeUleb(512)]]));

    // Global 0: $heap_ptr = 65536 (mutable i32)
    const globalSec = section(6, encodeVec([[I32, 0x01, OP.i32_const, ...encodeSleb(65536), OP.end]]));

    const exportItems = [
      [...encodeStr('memory'), 0x02, ...encodeUleb(0)],
      ...this.exports.map((e) => [...encodeStr(e.name), e.kind, ...encodeUleb(e.idx)])
    ];
    const exportSec = section(7, encodeVec(exportItems));

    const codeSec = section(10, encodeVec(this.funcs.map((f) => f.fb.encodeBody())));

    return Buffer.from([
      0x00, 0x61, 0x73, 0x6d, // magic
      0x01, 0x00, 0x00, 0x00, // version
      ...typeSec,
      ...funcSec,
      ...memSec,
      ...globalSec,
      ...exportSec,
      ...codeSec
    ]);
  }
}

function buildCoreWasm() {
  const mod = new ModuleBuilder();

  // Danh sách hàm nội bộ & export (đăng ký trước để lấy chỉ mục gọi lẫn nhau)
  const FN = {};
  FN.resetHeap = 0;
  FN.alloc = 1;
  FN.clampF32 = 2;
  FN.expF32 = 3;
  FN.tanhF32 = 4;
  FN.lnF32 = 5;
  FN.heapsortF32 = 6;
  FN.siftDown = 7;
  FN.highpassDcRms = 8;
  FN.vadAnalyze = 9;
  FN.normalizeSoftlimit = 10;
  FN.detectPitchYin = 11;
  FN.extractPitchContour = 12;
  FN.levenshteinU16 = 13;
  FN.lcsU16 = 14;
  FN.findSubslice = 15;
  FN.isSepU16 = 16;
  FN.fuzzyTokenScore = 17;

  // 0. wasm_reset_heap()
  mod.addFunc('wasm_reset_heap', [], [], (b) => {
    b.i32(65536).gset(0);
  }, 'wasm_reset_heap');

  // 1. wasm_alloc(bytes: i32) -> i32
  mod.addFunc('wasm_alloc', [I32], [I32], (b) => {
    const raw = b.local(I32);
    const aligned = b.local(I32);
    const ptr = b.local(I32);
    const next = b.local(I32);
    const curBytes = b.local(I32);
    const pages = b.local(I32);

    b.get(0).i32(0).op(OP.i32_le_s).if_(
      () => b.i32(8).set(raw),
      () => b.get(0).set(raw)
    );
    b.get(raw).i32(7).op(OP.i32_add).i32(-8).op(OP.i32_and).set(aligned);
    b.gget(0).tee(ptr).get(aligned).op(OP.i32_add).set(next);
    b.op(OP.memory_size).emit(0x00).i32(65536).op(OP.i32_mul).set(curBytes);

    b.get(next).get(curBytes).op(OP.i32_gt_u).if_(() => {
      b.get(next).get(curBytes).op(OP.i32_sub).i32(65535).op(OP.i32_add).i32(65536).op(OP.i32_div_u).set(pages);
      b.get(pages).op(OP.memory_grow).emit(0x00).i32(-1).op(OP.i32_eq).if_(() => {
        b.i32(0).op(OP.ret);
      });
    });

    b.get(next).gset(0);
    b.get(ptr);
  }, 'wasm_alloc');

  // 2. clamp_f32(x, lo, hi) -> f32
  mod.addFunc('clamp_f32', [F32, F32, F32], [F32], (b) => {
    b.get(0).get(1).op(OP.f32_max).get(2).op(OP.f32_min);
  });

  // 3. exp_f32(x: f32) -> f32
  mod.addFunc('exp_f32', [F32], [F32], (b) => {
    const xd = b.local(F64);
    const kf = b.local(I32);
    const r = b.local(F64);
    const r2 = b.local(F64);
    const er = b.local(F64);
    const expBits = b.local(I32);
    const scale = b.local(F64);

    b.get(0).f32(-40).f32(40).call(FN.clampF32).op(OP.f64_promote_f32).set(xd);
    // kf = trunc((xd * 1.4426950408889634) + (xd >= 0 ? 0.5 : -0.5))
    b.get(xd).f64(1.4426950408889634).op(OP.f64_mul);
    b.get(xd).f64(0).op(OP.f64_ge).if_(
      () => b.f64(0.5),
      () => b.f64(-0.5),
      F64
    );
    b.op(OP.f64_add).op(OP.i32_trunc_f64_s).set(kf);

    b.get(xd).get(kf).op(OP.f64_convert_i32_s).f64(0.6931471805599453).op(OP.f64_mul).op(OP.f64_sub).set(r);
    b.get(r).get(r).op(OP.f64_mul).set(r2);

    // Taylor bậc 6: 1 + r + r^2/2 + r^3/6 + r^4/24 + r^5/120 + r^6/720
    // Horner: 1 + r*(1 + r*(0.5 + r*(1/6 + r*(1/24 + r*(1/120 + r/720)))))
    b.f64(1.0)
      .get(r)
      .f64(1.0)
      .get(r)
      .f64(0.5)
      .get(r)
      .f64(1 / 6)
      .get(r)
      .f64(1 / 24)
      .get(r)
      .f64(1 / 120)
      .get(r)
      .f64(720)
      .op(OP.f64_div)
      .op(OP.f64_add)
      .op(OP.f64_mul)
      .op(OP.f64_add)
      .op(OP.f64_mul)
      .op(OP.f64_add)
      .op(OP.f64_mul)
      .op(OP.f64_add)
      .op(OP.f64_mul)
      .op(OP.f64_add)
      .op(OP.f64_mul)
      .op(OP.f64_add)
      .set(er);

    b.i32(1023).get(kf).op(OP.i32_add).set(expBits);
    b.get(expBits).i32(0).op(OP.i32_le_s).if_(
      () => b.f64(0.0).set(scale),
      () => {
        b.get(expBits).op(OP.i64_extend_i32_u).i64(52).op(OP.i64_shl).op(OP.f64_reinterpret_i64).set(scale);
      }
    );
    b.get(er).get(scale).op(OP.f64_mul).op(OP.f32_demote_f64);
  });

  // 4. tanh_f32(x: f32) -> f32
  mod.addFunc('tanh_f32', [F32], [F32], (b) => {
    const e2x = b.local(F32);
    b.get(0).f32(10).op(OP.f32_gt).if_(() => { b.f32(1).op(OP.ret); });
    b.get(0).f32(-10).op(OP.f32_lt).if_(() => { b.f32(-1).op(OP.ret); });
    b.get(0).f32(2).op(OP.f32_mul).call(FN.expF32).set(e2x);
    b.get(e2x).f32(1).op(OP.f32_sub).get(e2x).f32(1).op(OP.f32_add).op(OP.f32_div);
  });

  // 5. ln_f32(x: f32) -> f32
  mod.addFunc('ln_f32', [F32], [F32], (b) => {
    const bits = b.local(I64);
    const exp = b.local(I32);
    const mant = b.local(F64);
    const y = b.local(F64);
    const y2 = b.local(F64);
    const lnM = b.local(F64);

    b.get(0).f32(0).op(OP.f32_le).if_(() => { b.f32(-100).op(OP.ret); });
    b.get(0).op(OP.f64_promote_f32).op(OP.i64_reinterpret_f64).set(bits);
    b.get(bits).i64(52).op(OP.i64_shr_u).op(OP.i32_wrap_i64).i32(0x7ff).op(OP.i32_and).i32(1023).op(OP.i32_sub).set(exp);
    b.get(bits)
      .i64(0x000fffffffffffffn)
      .op(OP.i64_and)
      .i64(0x3ff0000000000000n)
      .op(OP.i64_or)
      .op(OP.f64_reinterpret_i64)
      .set(mant);

    b.get(mant).f64(1.4142135623730951).op(OP.f64_gt).if_(() => {
      b.get(mant).f64(0.5).op(OP.f64_mul).set(mant);
      b.get(exp).i32(1).op(OP.i32_add).set(exp);
    });

    b.get(mant).f64(1).op(OP.f64_sub).get(mant).f64(1).op(OP.f64_add).op(OP.f64_div).set(y);
    b.get(y).get(y).op(OP.f64_mul).set(y2);
    // 2*y*(1 + y2/3 + y2^2/5 + y2^3/7 + y2^4/9)
    b.f64(2).get(y).op(OP.f64_mul)
      .f64(1.0)
      .get(y2).f64(1 / 3)
      .get(y2).f64(1 / 5)
      .get(y2).f64(1 / 7)
      .get(y2).f64(9).op(OP.f64_div)
      .op(OP.f64_add).op(OP.f64_mul)
      .op(OP.f64_add).op(OP.f64_mul)
      .op(OP.f64_add).op(OP.f64_mul)
      .op(OP.f64_add).op(OP.f64_mul)
      .set(lnM);

    b.get(lnM).get(exp).op(OP.f64_convert_i32_s).f64(0.6931471805599453).op(OP.f64_mul).op(OP.f64_add).op(OP.f32_demote_f64);
  });

  // 7. sift_down(ptr: i32, root: i32, end: i32)
  // (Đăng ký ở slot 6 cho heapsort, slot 7 cho sift_down -> phải khớp đúng FN!)
  // Lưu ý thứ tự: FN.heapsortF32 = 6, FN.siftDown = 7!
  mod.addFunc('heapsort_f32', [I32, I32], [], (b) => {
    const start = b.local(I32);
    const end = b.local(I32);
    const tmp = b.local(F32);
    const endAddr = b.local(I32);

    b.get(1).i32(2).op(OP.i32_lt_s).if_(() => { b.op(OP.ret); });
    b.get(1).i32(2).op(OP.i32_div_s).set(start);
    b.whileLoop(
      () => b.get(start).i32(0).op(OP.i32_gt_s),
      () => {
        b.get(start).i32(1).op(OP.i32_sub).set(start);
        b.get(0).get(start).get(1).call(FN.siftDown);
      }
    );
    b.get(1).set(end);
    b.whileLoop(
      () => b.get(end).i32(1).op(OP.i32_gt_s),
      () => {
        b.get(end).i32(1).op(OP.i32_sub).set(end);
        b.get(0).get(end).i32(4).op(OP.i32_mul).op(OP.i32_add).set(endAddr);
        b.get(0).loadF32().set(tmp);
        b.get(0).get(endAddr).loadF32().storeF32();
        b.get(endAddr).get(tmp).storeF32();
        b.get(0).i32(0).get(end).call(FN.siftDown);
      }
    );
  });

  mod.addFunc('sift_down', [I32, I32, I32], [], (b) => {
    const root = b.local(I32);
    const child = b.local(I32);
    const swapIdx = b.local(I32);
    const rVal = b.local(F32);
    const sVal = b.local(F32);
    const cVal = b.local(F32);
    const rAddr = b.local(I32);
    const sAddr = b.local(I32);

    b.get(1).set(root);
    b.block(() => {
      b.loop(() => {
        b.get(root).i32(2).op(OP.i32_mul).i32(1).op(OP.i32_add).set(child);
        b.get(child).get(2).op(OP.i32_ge_s).brIf(1);
        b.get(root).set(swapIdx);

        b.get(0).get(swapIdx).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(sVal);
        b.get(0).get(child).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(cVal);
        b.get(sVal).get(cVal).op(OP.f32_lt).if_(() => {
          b.get(child).set(swapIdx);
          b.get(cVal).set(sVal);
        });

        b.get(child).i32(1).op(OP.i32_add).get(2).op(OP.i32_lt_s).if_(() => {
          b.get(0).get(child).i32(1).op(OP.i32_add).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(cVal);
          b.get(sVal).get(cVal).op(OP.f32_lt).if_(() => {
            b.get(child).i32(1).op(OP.i32_add).set(swapIdx);
          });
        });

        b.get(swapIdx).get(root).op(OP.i32_eq).brIf(1);

        b.get(0).get(root).i32(4).op(OP.i32_mul).op(OP.i32_add).set(rAddr);
        b.get(0).get(swapIdx).i32(4).op(OP.i32_mul).op(OP.i32_add).set(sAddr);
        b.get(rAddr).loadF32().set(rVal);
        b.get(rAddr).get(sAddr).loadF32().storeF32();
        b.get(sAddr).get(rVal).storeF32();
        b.get(swapIdx).set(root);
        b.br(0);
      });
    });
  });

  // 8. wasm_highpass_dc_rms(ptr: i32, len: i32, sample_rate: f32, out_stats_ptr: i32) -> f32
  mod.addFunc('wasm_highpass_dc_rms', [I32, I32, F32, I32], [F32], (b) => {
    const i = b.local(I32);
    const addr = b.local(I32);
    const sum = b.local(F64);
    const mean = b.local(F32);
    const s = b.local(F32);
    const absS = b.local(F32);
    const rawSumSq = b.local(F64);
    const rawPeak = b.local(F32);
    const rawRms = b.local(F32);
    const sr = b.local(F64);
    const rc = b.local(F64);
    const dt = b.local(F64);
    const alpha = b.local(F32);
    const prevIn = b.local(F32);
    const prevOut = b.local(F32);
    const x = b.local(F32);
    const y = b.local(F32);
    const filtSumSq = b.local(F64);
    const filtPeak = b.local(F32);
    const filtRms = b.local(F32);

    b.get(0).op(OP.i32_eqz).get(1).i32(0).op(OP.i32_le_s).op(OP.i32_or).if_(() => {
      b.get(3).i32(0).op(OP.i32_ne).if_(() => {
        b.get(3).f32(0).storeF32(0);
        b.get(3).f32(0).storeF32(4);
        b.get(3).f32(0).storeF32(8);
        b.get(3).f32(0).storeF32(12);
      });
      b.f32(0).op(OP.ret);
    });

    // Tính tổng f64 -> mean
    b.f64(0).set(sum);
    b.i32(0).set(i);
    b.whileLoop(
      () => b.get(i).get(1).op(OP.i32_lt_s),
      () => {
        b.get(0).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().op(OP.f64_promote_f32).get(sum).op(OP.f64_add).set(sum);
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );
    b.get(sum).get(1).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f32_demote_f64).set(mean);

    // Khử DC tại chỗ + đo raw_rms, raw_peak
    b.f64(0).set(rawSumSq);
    b.f32(0).set(rawPeak);
    b.i32(0).set(i);
    b.whileLoop(
      () => b.get(i).get(1).op(OP.i32_lt_s),
      () => {
        b.get(0).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).set(addr);
        b.get(addr).loadF32().get(mean).op(OP.f32_sub).set(s);
        b.get(addr).get(s).storeF32();
        b.get(s).op(OP.f32_abs).set(absS);
        b.get(absS).get(rawPeak).op(OP.f32_gt).if_(() => b.get(absS).set(rawPeak));
        b.get(s).op(OP.f64_promote_f32).tee(sum).get(sum).op(OP.f64_mul).get(rawSumSq).op(OP.f64_add).set(rawSumSq);
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );
    b.get(rawSumSq).get(1).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f64_sqrt).op(OP.f32_demote_f64).set(rawRms);

    // Lọc thông cao 80Hz tại chỗ
    b.get(2).f32(0).op(OP.f32_gt).if_(
      () => b.get(2).op(OP.f64_promote_f32).set(sr),
      () => b.f64(16000).set(sr)
    );
    b.f64(1.0 / (2.0 * Math.PI * 80.0)).set(rc);
    b.f64(1.0).get(sr).op(OP.f64_div).set(dt);
    b.get(rc).get(rc).get(dt).op(OP.f64_add).op(OP.f64_div).op(OP.f32_demote_f64).set(alpha);

    b.get(1).i32(2).op(OP.i32_ge_s).if_(() => {
      b.get(0).loadF32().tee(prevIn).set(prevOut);
      b.i32(1).set(i);
      b.whileLoop(
        () => b.get(i).get(1).op(OP.i32_lt_s),
        () => {
          b.get(0).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).set(addr);
          b.get(addr).loadF32().set(x);
          b.get(alpha).get(prevOut).get(x).op(OP.f32_add).get(prevIn).op(OP.f32_sub).op(OP.f32_mul).set(y);
          b.get(x).set(prevIn);
          b.get(y).set(prevOut);
          b.get(addr).get(y).storeF32();
          b.get(i).i32(1).op(OP.i32_add).set(i);
        }
      );
    });

    // Đo filtered_rms, filtered_peak
    b.f64(0).set(filtSumSq);
    b.f32(0).set(filtPeak);
    b.i32(0).set(i);
    b.whileLoop(
      () => b.get(i).get(1).op(OP.i32_lt_s),
      () => {
        b.get(0).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(s);
        b.get(s).op(OP.f32_abs).set(absS);
        b.get(absS).get(filtPeak).op(OP.f32_gt).if_(() => b.get(absS).set(filtPeak));
        b.get(s).op(OP.f64_promote_f32).tee(sum).get(sum).op(OP.f64_mul).get(filtSumSq).op(OP.f64_add).set(filtSumSq);
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );
    b.get(filtSumSq).get(1).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f64_sqrt).op(OP.f32_demote_f64).set(filtRms);

    b.get(3).i32(0).op(OP.i32_ne).if_(() => {
      b.get(3).get(rawRms).storeF32(0);
      b.get(3).get(rawPeak).storeF32(4);
      b.get(3).get(filtRms).storeF32(8);
      b.get(3).get(filtPeak).storeF32(12);
    });
    b.get(filtRms);
  }, 'wasm_highpass_dc_rms');

  // 9. wasm_vad_analyze(ptr: i32, len: i32, frame_samples: i32, pad_frames: i32, out_meta_ptr: i32) -> i32
  mod.addFunc('wasm_vad_analyze', [I32, I32, I32, I32, I32], [I32], (b) => {
    const fs = b.local(I32);
    const pad = b.local(I32);
    const n = b.local(I32);
    const totalFrames = b.local(I32);
    const mark = b.local(I32);
    const rmsPtr = b.local(I32);
    const sortedPtr = b.local(I32);
    const f = b.local(I32);
    const k = b.local(I32);
    const base = b.local(I32);
    const sumSq = b.local(F64);
    const s = b.local(F64);
    const r = b.local(F32);
    const p20Idx = b.local(I32);
    const noiseFloor = b.local(F32);
    const vadThresh = b.local(F32);
    const firstActive = b.local(I32);
    const lastActive = b.local(I32);
    const voicedFrames = b.local(I32);
    const voicedSumSq = b.local(F64);
    const pauseMin = b.local(I32);
    const longPauseMin = b.local(I32);
    const pauseCount = b.local(I32);
    const longPauseCount = b.local(I32);
    const silentRun = b.local(I32);
    const startSample = b.local(I32);
    const endSample = b.local(I32);
    const sf = b.local(I32);
    const ef = b.local(I32);
    const snrDbX100 = b.local(I32);
    const speechRms = b.local(F32);
    const noiseRef = b.local(F32);
    const snrDb = b.local(F32);

    b.get(2).i32(0).op(OP.i32_gt_s).if_(
      () => b.get(2).set(fs),
      () => b.i32(320).set(fs)
    );
    b.get(3).i32(0).op(OP.i32_ge_s).if_(
      () => b.get(3).set(pad),
      () => b.i32(0).set(pad)
    );
    b.get(1).i32(0).op(OP.i32_gt_s).if_(
      () => b.get(1).set(n),
      () => b.i32(0).set(n)
    );
    b.get(n).get(fs).op(OP.i32_div_s).set(totalFrames);

    b.get(0).op(OP.i32_eqz).get(n).op(OP.i32_eqz).op(OP.i32_or).get(totalFrames).i32(3).op(OP.i32_lt_s).op(OP.i32_or).if_(() => {
      b.get(4).i32(0).op(OP.i32_ne).if_(() => {
        b.get(4).i32(0).storeI32(0);
        b.get(4).get(n).storeI32(4);
        b.get(4).i32(0).storeI32(8);
        b.get(4).get(totalFrames).storeI32(12);
        b.get(4).i32(0).storeI32(16);
        b.get(4).i32(0).storeI32(20);
        b.get(4).i32(0).storeI32(24);
        b.get(4).i32(0).storeI32(28);
      });
      b.get(n).op(OP.ret);
    });

    b.gget(0).set(mark);
    b.get(totalFrames).i32(4).op(OP.i32_mul).call(FN.alloc).set(rmsPtr);
    b.get(totalFrames).i32(4).op(OP.i32_mul).call(FN.alloc).set(sortedPtr);
    b.get(rmsPtr).op(OP.i32_eqz).get(sortedPtr).op(OP.i32_eqz).op(OP.i32_or).if_(() => {
      b.get(mark).gset(0);
      b.get(n).op(OP.ret);
    });

    // Tính RMS từng khung
    b.i32(0).set(f);
    b.whileLoop(
      () => b.get(f).get(totalFrames).op(OP.i32_lt_s),
      () => {
        b.get(f).get(fs).op(OP.i32_mul).set(base);
        b.f64(0).set(sumSq);
        b.i32(0).set(k);
        b.whileLoop(
          () => b.get(k).get(fs).op(OP.i32_lt_s),
          () => {
            b.get(0).get(base).get(k).op(OP.i32_add).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().op(OP.f64_promote_f32).tee(s).get(s).op(OP.f64_mul).get(sumSq).op(OP.f64_add).set(sumSq);
            b.get(k).i32(1).op(OP.i32_add).set(k);
          }
        );
        b.get(sumSq).get(fs).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f64_sqrt).op(OP.f32_demote_f64).set(r);
        b.get(rmsPtr).get(f).i32(4).op(OP.i32_mul).op(OP.i32_add).get(r).storeF32();
        b.get(sortedPtr).get(f).i32(4).op(OP.i32_mul).op(OP.i32_add).get(r).storeF32();
        b.get(f).i32(1).op(OP.i32_add).set(f);
      }
    );

    b.get(sortedPtr).get(totalFrames).call(FN.heapsortF32);
    b.get(totalFrames).i32(20).op(OP.i32_mul).i32(100).op(OP.i32_div_s).set(p20Idx);
    b.get(p20Idx).get(totalFrames).i32(1).op(OP.i32_sub).op(OP.i32_ge_s).if_(() => {
      b.get(totalFrames).i32(1).op(OP.i32_sub).set(p20Idx);
    });
    b.get(sortedPtr).get(p20Idx).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(noiseFloor);
    b.get(noiseFloor).f32(2.2).op(OP.f32_mul).f32(0.0015).f32(0.012).call(FN.clampF32).set(vadThresh);

    b.i32(-1).set(firstActive);
    b.i32(-1).set(lastActive);
    b.i32(0).set(voicedFrames);
    b.f64(0).set(voicedSumSq);

    b.i32(0).set(f);
    b.whileLoop(
      () => b.get(f).get(totalFrames).op(OP.i32_lt_s),
      () => {
        b.get(rmsPtr).get(f).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(r);
        b.get(r).get(vadThresh).op(OP.f32_ge).if_(() => {
          b.get(firstActive).i32(-1).op(OP.i32_eq).if_(() => b.get(f).set(firstActive));
          b.get(f).set(lastActive);
          b.get(voicedFrames).i32(1).op(OP.i32_add).set(voicedFrames);
          b.get(r).op(OP.f64_promote_f32).tee(s).get(s).op(OP.f64_mul).get(voicedSumSq).op(OP.f64_add).set(voicedSumSq);
        });
        b.get(f).i32(1).op(OP.i32_add).set(f);
      }
    );

    // Đếm pause giữa firstActive..lastActive
    b.i32(240 * 16).get(fs).i32(2).op(OP.i32_div_s).op(OP.i32_add).get(fs).op(OP.i32_div_s).set(pauseMin);
    b.get(pauseMin).i32(1).op(OP.i32_lt_s).if_(() => b.i32(1).set(pauseMin));
    b.i32(600 * 16).get(fs).i32(2).op(OP.i32_div_s).op(OP.i32_add).get(fs).op(OP.i32_div_s).set(longPauseMin);
    b.get(longPauseMin).i32(2).op(OP.i32_lt_s).if_(() => b.i32(2).set(longPauseMin));

    b.i32(0).set(pauseCount);
    b.i32(0).set(longPauseCount);
    b.get(firstActive).i32(-1).op(OP.i32_ne).get(lastActive).get(firstActive).op(OP.i32_gt_s).op(OP.i32_and).if_(() => {
      b.i32(0).set(silentRun);
      b.get(firstActive).set(f);
      b.whileLoop(
        () => b.get(f).get(lastActive).op(OP.i32_le_s),
        () => {
          b.get(rmsPtr).get(f).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().get(vadThresh).op(OP.f32_lt).if_(
            () => {
              b.get(silentRun).i32(1).op(OP.i32_add).set(silentRun);
            },
            () => {
              b.get(silentRun).get(pauseMin).op(OP.i32_ge_s).if_(() => {
                b.get(pauseCount).i32(1).op(OP.i32_add).set(pauseCount);
              });
              b.get(silentRun).get(longPauseMin).op(OP.i32_ge_s).if_(() => {
                b.get(longPauseCount).i32(1).op(OP.i32_add).set(longPauseCount);
              });
              b.i32(0).set(silentRun);
            }
          );
          b.get(f).i32(1).op(OP.i32_add).set(f);
        }
      );
    });

    // Tính startSample, endSample
    b.get(firstActive).i32(-1).op(OP.i32_eq).if_(
      () => {
        b.i32(0).set(startSample);
        b.get(n).set(endSample);
      },
      () => {
        b.get(firstActive).get(pad).op(OP.i32_sub).set(sf);
        b.get(sf).i32(0).op(OP.i32_lt_s).if_(() => b.i32(0).set(sf));
        b.get(lastActive).i32(1).op(OP.i32_add).get(pad).op(OP.i32_add).set(ef);
        b.get(ef).get(totalFrames).op(OP.i32_gt_s).if_(() => b.get(totalFrames).set(ef));
        b.get(sf).get(fs).op(OP.i32_mul).set(startSample);
        b.get(ef).get(totalFrames).op(OP.i32_ge_s).if_(
          () => b.get(n).set(endSample),
          () => b.get(ef).get(fs).op(OP.i32_mul).set(endSample)
        );
      }
    );

    // SNR (dB * 100)
    b.get(voicedFrames).i32(0).op(OP.i32_gt_s).if_(
      () => {
        b.get(voicedSumSq).get(voicedFrames).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f64_sqrt).op(OP.f32_demote_f64).set(speechRms);
        b.get(noiseFloor).f32(1e-5).op(OP.f32_max).set(noiseRef);
        b.get(speechRms).get(noiseRef).op(OP.f32_div).call(FN.lnF32).f32(0.43429448).op(OP.f32_mul).f32(20.0).op(OP.f32_mul)
          .f32(-60.0).f32(90.0).call(FN.clampF32).set(snrDb);
        b.get(snrDb).f32(100.0).op(OP.f32_mul);
        b.get(snrDb).f32(0).op(OP.f32_ge).if_(
          () => b.f32(0.5),
          () => b.f32(-0.5),
          F32
        );
        b.op(OP.f32_add).op(OP.i32_trunc_f32_s).set(snrDbX100);
      },
      () => b.i32(0).set(snrDbX100)
    );

    b.get(4).i32(0).op(OP.i32_ne).if_(() => {
      b.get(4).get(startSample).storeI32(0);
      b.get(4).get(endSample).storeI32(4);
      b.get(4).get(voicedFrames).storeI32(8);
      b.get(4).get(totalFrames).storeI32(12);
      b.get(4).get(pauseCount).storeI32(16);
      b.get(4).get(longPauseCount).storeI32(20);
      b.get(4).get(snrDbX100).storeI32(24);
      b.get(4).get(noiseFloor).f32(100000.0).op(OP.f32_mul).f32(0.5).op(OP.f32_add).op(OP.i32_trunc_f32_s).storeI32(28);
    });

    b.get(mark).gset(0);
    b.get(endSample).get(startSample).op(OP.i32_sub);
  }, 'wasm_vad_analyze');

  // 10. wasm_normalize_softlimit(ptr: i32, len: i32, target_peak: f32, max_gain: f32) -> f32
  mod.addFunc('wasm_normalize_softlimit', [I32, I32, F32, F32], [F32], (b) => {
    const i = b.local(I32);
    const addr = b.local(I32);
    const sumSq = b.local(F64);
    const s = b.local(F32);
    const sd = b.local(F64);
    const peak = b.local(F32);
    const rms = b.local(F32);
    const step = b.local(I32);
    const mLen = b.local(I32);
    const mark = b.local(I32);
    const magsPtr = b.local(I32);
    const idx = b.local(I32);
    const p98 = b.local(F32);
    const pIdx = b.local(I32);
    const tgt = b.local(F32);
    const mg = b.local(F32);
    const refPeak = b.local(F32);
    const gain = b.local(F32);
    const x = b.local(F32);
    const ax = b.local(F32);
    const y = b.local(F32);

    b.get(0).op(OP.i32_eqz).get(1).i32(0).op(OP.i32_le_s).op(OP.i32_or).if_(() => {
      b.f32(0).op(OP.ret);
    });

    b.f64(0).set(sumSq);
    b.f32(0).set(peak);
    b.i32(0).set(i);
    b.whileLoop(
      () => b.get(i).get(1).op(OP.i32_lt_s),
      () => {
        b.get(0).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(s);
        b.get(s).op(OP.f32_abs).set(ax);
        b.get(ax).get(peak).op(OP.f32_gt).if_(() => b.get(ax).set(peak));
        b.get(s).op(OP.f64_promote_f32).tee(sd).get(sd).op(OP.f64_mul).get(sumSq).op(OP.f64_add).set(sumSq);
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );
    b.get(sumSq).get(1).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f64_sqrt).op(OP.f32_demote_f64).set(rms);

    b.get(1).i32(4000).op(OP.i32_div_s).set(step);
    b.get(step).i32(1).op(OP.i32_lt_s).if_(() => b.i32(1).set(step));
    b.get(1).get(step).op(OP.i32_add).i32(1).op(OP.i32_sub).get(step).op(OP.i32_div_s).set(mLen);

    b.gget(0).set(mark);
    b.get(mLen).i32(4).op(OP.i32_mul).call(FN.alloc).set(magsPtr);
    b.get(peak).set(p98);

    b.get(magsPtr).i32(0).op(OP.i32_ne).if_(() => {
      b.i32(0).set(idx);
      b.i32(0).set(i);
      b.whileLoop(
        () => b.get(i).get(1).op(OP.i32_lt_s).get(idx).get(mLen).op(OP.i32_lt_s).op(OP.i32_and),
        () => {
          b.get(magsPtr).get(idx).i32(4).op(OP.i32_mul).op(OP.i32_add)
            .get(0).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().op(OP.f32_abs).storeF32();
          b.get(idx).i32(1).op(OP.i32_add).set(idx);
          b.get(i).get(step).op(OP.i32_add).set(i);
        }
      );
      b.get(idx).i32(0).op(OP.i32_gt_s).if_(() => {
        b.get(magsPtr).get(idx).call(FN.heapsortF32);
        b.get(idx).i32(98).op(OP.i32_mul).i32(100).op(OP.i32_div_s).set(pIdx);
        b.get(pIdx).get(idx).i32(1).op(OP.i32_sub).op(OP.i32_ge_s).if_(() => {
          b.get(idx).i32(1).op(OP.i32_sub).set(pIdx);
        });
        b.get(magsPtr).get(pIdx).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(p98);
      });
    });
    b.get(mark).gset(0);

    b.get(2).f32(0).op(OP.f32_gt).if_(
      () => b.get(2).set(tgt),
      () => b.f32(0.85).set(tgt)
    );
    b.get(3).f32(0).op(OP.f32_gt).if_(
      () => b.get(3).set(mg),
      () => b.f32(14.0).set(mg)
    );
    b.get(p98).f32(0).op(OP.f32_gt).if_(
      () => b.get(p98).set(refPeak),
      () => b.get(peak).set(refPeak)
    );
    b.get(refPeak).get(rms).f32(2.2).op(OP.f32_mul).op(OP.f32_max).f32(0.005).op(OP.f32_max).set(refPeak);

    b.get(refPeak).f32(0).op(OP.f32_gt).get(refPeak).get(tgt).op(OP.f32_lt).op(OP.i32_and).if_(
      () => b.get(tgt).get(refPeak).op(OP.f32_div).get(mg).op(OP.f32_min).set(gain),
      () => b.f32(1.0).set(gain)
    );

    b.f64(0).set(sumSq);
    b.i32(0).set(i);
    b.whileLoop(
      () => b.get(i).get(1).op(OP.i32_lt_s),
      () => {
        b.get(0).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).set(addr);
        b.get(addr).loadF32().get(gain).op(OP.f32_mul).set(x);
        b.get(x).op(OP.f32_abs).set(ax);
        b.get(ax).f32(0.85).op(OP.f32_le).if_(
          () => b.get(x).set(y),
          () => {
            b.get(x).f32(0).op(OP.f32_lt).if_(
              () => b.f32(-1.0),
              () => b.f32(1.0),
              F32
            );
            b.f32(0.85)
              .f32(0.14)
              .get(ax).f32(0.85).op(OP.f32_sub).f32(0.14).op(OP.f32_div).call(FN.tanhF32)
              .op(OP.f32_mul).op(OP.f32_add).op(OP.f32_mul).set(y);
          }
        );
        b.get(addr).get(y).storeF32();
        b.get(y).op(OP.f64_promote_f32).tee(sd).get(sd).op(OP.f64_mul).get(sumSq).op(OP.f64_add).set(sumSq);
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );

    b.get(sumSq).get(1).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f64_sqrt).op(OP.f32_demote_f64);
  }, 'wasm_normalize_softlimit');

  // 11. wasm_detect_pitch_yin(ptr: i32, len: i32, sample_rate: f32, min_freq: f32, max_freq: f32) -> f32
  mod.addFunc('wasm_detect_pitch_yin', [I32, I32, F32, F32, F32], [F32], (b) => {
    const sr = b.local(F32);
    const fMin = b.local(F32);
    const fMax = b.local(F32);
    const i = b.local(I32);
    const j = b.local(I32);
    const sumSq = b.local(F64);
    const s = b.local(F64);
    const rms = b.local(F32);
    const tauMin = b.local(I32);
    const tauMax = b.local(I32);
    const halfN = b.local(I32);
    const w = b.local(I32);
    const mark = b.local(I32);
    const cmndfPtr = b.local(I32);
    const tau = b.local(I32);
    const diffSum = b.local(F64);
    const runningSum = b.local(F64);
    const d = b.local(F64);
    const val = b.local(F32);
    const bestTau = b.local(I32);
    const bestGlobalTau = b.local(I32);
    const bestGlobalVal = b.local(F32);
    const chosenTau = b.local(I32);
    const betterTau = b.local(F32);
    const s0 = b.local(F32);
    const s1 = b.local(F32);
    const s2 = b.local(F32);
    const denom = b.local(F32);
    const delta = b.local(F32);

    b.get(0).op(OP.i32_eqz).get(1).i32(64).op(OP.i32_lt_s).op(OP.i32_or).if_(() => {
      b.f32(0).op(OP.ret);
    });
    b.get(2).f32(0).op(OP.f32_gt).if_(() => b.get(2).set(sr), () => b.f32(16000).set(sr));
    b.get(3).f32(20).op(OP.f32_gt).if_(() => b.get(3).set(fMin), () => b.f32(65).set(fMin));
    b.get(4).get(fMin).op(OP.f32_gt).if_(() => b.get(4).set(fMax), () => b.f32(500).set(fMax));

    // Kiểm tra ngưỡng năng lượng RMS
    b.f64(0).set(sumSq);
    b.i32(0).set(i);
    b.whileLoop(
      () => b.get(i).get(1).op(OP.i32_lt_s),
      () => {
        b.get(0).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().op(OP.f64_promote_f32).tee(s).get(s).op(OP.f64_mul).get(sumSq).op(OP.f64_add).set(sumSq);
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );
    b.get(sumSq).get(1).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f64_sqrt).op(OP.f32_demote_f64).set(rms);
    b.get(rms).f32(0.004).op(OP.f32_lt).if_(() => { b.f32(0).op(OP.ret); });

    b.get(sr).get(fMax).op(OP.f32_div).op(OP.i32_trunc_f32_s).set(tauMin);
    b.get(tauMin).i32(2).op(OP.i32_lt_s).if_(() => b.i32(2).set(tauMin));
    b.get(1).i32(2).op(OP.i32_div_s).set(halfN);
    b.get(sr).get(fMin).op(OP.f32_div).op(OP.i32_trunc_f32_s).i32(1).op(OP.i32_add).set(tauMax);
    b.get(tauMax).get(halfN).i32(1).op(OP.i32_sub).op(OP.i32_gt_s).if_(() => {
      b.get(halfN).i32(1).op(OP.i32_sub).set(tauMax);
    });
    b.get(tauMax).get(tauMin).i32(2).op(OP.i32_add).op(OP.i32_le_s).if_(() => { b.f32(0).op(OP.ret); });
    b.get(halfN).set(w);

    b.gget(0).set(mark);
    b.get(tauMax).i32(1).op(OP.i32_add).i32(4).op(OP.i32_mul).call(FN.alloc).set(cmndfPtr);
    b.get(cmndfPtr).op(OP.i32_eqz).if_(() => {
      b.get(mark).gset(0);
      b.f32(0).op(OP.ret);
    });
    b.get(cmndfPtr).f32(1.0).storeF32();

    b.f64(0).set(runningSum);
    b.i32(0).set(bestTau);
    b.get(tauMin).set(bestGlobalTau);
    b.f32(10.0).set(bestGlobalVal);

    b.i32(1).set(tau);
    b.whileLoop(
      () => b.get(tau).get(tauMax).op(OP.i32_le_s),
      () => {
        b.f64(0).set(diffSum);
        b.i32(0).set(j);
        b.whileLoop(
          () => b.get(j).get(w).op(OP.i32_lt_s),
          () => {
            b.get(0).get(j).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32()
              .get(0).get(j).get(tau).op(OP.i32_add).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32()
              .op(OP.f32_sub).op(OP.f64_promote_f32).tee(d).get(d).op(OP.f64_mul).get(diffSum).op(OP.f64_add).set(diffSum);
            b.get(j).i32(1).op(OP.i32_add).set(j);
          }
        );
        b.get(runningSum).get(diffSum).op(OP.f64_add).set(runningSum);
        b.get(runningSum).f64(0).op(OP.f64_gt).if_(
          () => b.get(diffSum).get(tau).op(OP.f64_convert_i32_s).op(OP.f64_mul).get(runningSum).op(OP.f64_div).op(OP.f32_demote_f64).set(val),
          () => b.f32(1.0).set(val)
        );
        b.get(cmndfPtr).get(tau).i32(4).op(OP.i32_mul).op(OP.i32_add).get(val).storeF32();

        b.get(tau).get(tauMin).op(OP.i32_ge_s).if_(() => {
          b.get(val).get(bestGlobalVal).op(OP.f32_lt).if_(() => {
            b.get(val).set(bestGlobalVal);
            b.get(tau).set(bestGlobalTau);
          });
          b.get(bestTau).op(OP.i32_eqz).get(val).f32(0.15).op(OP.f32_lt).op(OP.i32_and).if_(() => {
            b.get(tau).set(bestTau);
          });
        });
        b.get(tau).i32(1).op(OP.i32_add).set(tau);
      }
    );

    b.get(bestTau).i32(0).op(OP.i32_ne).if_(
      () => {
        b.get(bestTau).set(chosenTau);
        b.whileLoop(
          () => {
            b.get(chosenTau).i32(1).op(OP.i32_add).get(tauMax).op(OP.i32_le_s).if_(
              () => {
                b.get(cmndfPtr).get(chosenTau).i32(1).op(OP.i32_add).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32()
                  .get(cmndfPtr).get(chosenTau).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32()
                  .op(OP.f32_lt);
              },
              () => b.i32(0),
              I32
            );
          },
          () => b.get(chosenTau).i32(1).op(OP.i32_add).set(chosenTau)
        );
      },
      () => {
        b.get(bestGlobalVal).f32(0.35).op(OP.f32_lt).if_(
          () => b.get(bestGlobalTau).set(chosenTau),
          () => {
            b.get(mark).gset(0);
            b.f32(0).op(OP.ret);
          }
        );
      }
    );

    b.get(chosenTau).op(OP.f32_convert_i32_s).set(betterTau);
    b.get(chosenTau).get(tauMin).op(OP.i32_gt_s).get(chosenTau).get(tauMax).op(OP.i32_lt_s).op(OP.i32_and).if_(() => {
      b.get(cmndfPtr).get(chosenTau).i32(1).op(OP.i32_sub).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(s0);
      b.get(cmndfPtr).get(chosenTau).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(s1);
      b.get(cmndfPtr).get(chosenTau).i32(1).op(OP.i32_add).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(s2);
      b.f32(2.0).get(s0).f32(2.0).get(s1).op(OP.f32_mul).op(OP.f32_sub).get(s2).op(OP.f32_add).op(OP.f32_mul).set(denom);
      b.get(denom).op(OP.f32_abs).f32(1e-6).op(OP.f32_gt).if_(() => {
        b.get(s0).get(s2).op(OP.f32_sub).get(denom).op(OP.f32_div).f32(-0.5).f32(0.5).call(FN.clampF32).set(delta);
        b.get(chosenTau).op(OP.f32_convert_i32_s).get(delta).op(OP.f32_add).set(betterTau);
      });
    });

    b.get(mark).gset(0);
    b.get(betterTau).f32(0).op(OP.f32_gt).if_(
      () => b.get(sr).get(betterTau).op(OP.f32_div),
      () => b.f32(0),
      F32
    );
  }, 'wasm_detect_pitch_yin');

  // 12. wasm_extract_pitch_contour(ptr, len, sample_rate, hop, win, out_contour_ptr, max_points, out_summary_ptr) -> i32
  mod.addFunc('wasm_extract_pitch_contour', [I32, I32, F32, I32, I32, I32, I32, I32], [I32], (b) => {
    const sr = b.local(F32);
    const win = b.local(I32);
    const hop = b.local(I32);
    const n = b.local(I32);
    const maxPts = b.local(I32);
    const rawFrames = b.local(I32);
    const stride = b.local(I32);
    const outCount = b.local(I32);
    const finalCount = b.local(I32);
    const mark = b.local(I32);
    const bufPtr = b.local(I32);
    const i = b.local(I32);
    const k = b.local(I32);
    const voicedCount = b.local(I32);
    const f0 = b.local(F32);
    const vPtr = b.local(I32);
    const posPtr = b.local(I32);
    const sumHz = b.local(F64);
    const minHz = b.local(F32);
    const maxHz = b.local(F32);
    const minIdx = b.local(I32);
    const v = b.local(F32);
    const meanHz = b.local(F32);
    const varHz = b.local(F64);
    const varSemi = b.local(F64);
    const t0 = b.local(F32);
    const t1 = b.local(F32);
    const tSpan = b.local(F32);
    const sumU = b.local(F64);
    const sumS = b.local(F64);
    const sumUU = b.local(F64);
    const sumUS = b.local(F64);
    const dh = b.local(F64);
    const semi = b.local(F64);
    const u = b.local(F64);
    const stdHz = b.local(F32);
    const stdSemi = b.local(F32);
    const denom = b.local(F64);
    const slopeSemi = b.local(F32);
    const turnPos = b.local(F32);
    const edge = b.local(I32);
    const startHz = b.local(F32);
    const endHz = b.local(F32);
    const lowEdge = b.local(F32);
    const dipSemi = b.local(F32);
    const toneClass = b.local(F32);

    b.get(2).f32(0).op(OP.f32_gt).if_(() => b.get(2).set(sr), () => b.f32(16000).set(sr));
    b.get(4).i32(64).op(OP.i32_ge_s).if_(() => b.get(4).set(win), () => b.i32(640).set(win));
    b.get(3).i32(0).op(OP.i32_gt_s).if_(() => b.get(3).set(hop), () => b.i32(160).set(hop));
    b.get(1).i32(0).op(OP.i32_gt_s).if_(() => b.get(1).set(n), () => b.i32(0).set(n));
    b.get(6).i32(0).op(OP.i32_gt_s).if_(() => b.get(6).set(maxPts), () => b.i32(0).set(maxPts));

    b.get(0).op(OP.i32_eqz).get(n).get(win).op(OP.i32_lt_s).op(OP.i32_or).if_(() => {
      b.get(7).i32(0).op(OP.i32_ne).if_(() => {
        for (let off = 0; off < 32; off += 4) b.get(7).f32(0).storeF32(off);
      });
      b.i32(0).op(OP.ret);
    });

    b.get(n).get(win).op(OP.i32_sub).get(hop).op(OP.i32_div_s).i32(1).op(OP.i32_add).set(rawFrames);
    b.get(maxPts).i32(0).op(OP.i32_gt_s).get(rawFrames).get(maxPts).op(OP.i32_gt_s).op(OP.i32_and).if_(
      () => b.get(rawFrames).get(maxPts).op(OP.i32_add).i32(1).op(OP.i32_sub).get(maxPts).op(OP.i32_div_s).set(stride),
      () => b.i32(1).set(stride)
    );
    b.get(rawFrames).get(stride).op(OP.i32_add).i32(1).op(OP.i32_sub).get(stride).op(OP.i32_div_s).set(outCount);
    b.get(maxPts).i32(0).op(OP.i32_gt_s).if_(
      () => {
        b.get(outCount).get(maxPts).op(OP.i32_lt_s).if_(
          () => b.get(outCount).set(finalCount),
          () => b.get(maxPts).set(finalCount)
        );
      },
      () => b.get(outCount).set(finalCount)
    );

    b.gget(0).set(mark);
    b.get(5).i32(0).op(OP.i32_ne).if_(
      () => b.get(5).set(bufPtr),
      () => b.get(finalCount).i32(4).op(OP.i32_mul).call(FN.alloc).set(bufPtr)
    );
    b.get(bufPtr).op(OP.i32_eqz).if_(() => {
      b.get(mark).gset(0);
      b.i32(0).op(OP.ret);
    });

    b.i32(0).set(voicedCount);
    b.i32(0).set(i);
    b.whileLoop(
      () => b.get(i).get(finalCount).op(OP.i32_lt_s),
      () => {
        b.get(0)
          .get(i).get(stride).op(OP.i32_mul).get(hop).op(OP.i32_mul).i32(4).op(OP.i32_mul).op(OP.i32_add)
          .get(win).get(sr).f32(65).f32(500).call(FN.detectPitchYin).set(f0);
        b.get(bufPtr).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).get(f0).storeF32();
        b.get(f0).f32(0).op(OP.f32_gt).if_(() => {
          b.get(voicedCount).i32(1).op(OP.i32_add).set(voicedCount);
        });
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );

    b.get(7).i32(0).op(OP.i32_ne).if_(() => {
      b.get(voicedCount).i32(2).op(OP.i32_lt_s).if_(
        () => {
          for (let off = 0; off < 32; off += 4) b.get(7).f32(0).storeF32(off);
        },
        () => {
          b.get(voicedCount).i32(4).op(OP.i32_mul).call(FN.alloc).set(vPtr);
          b.get(voicedCount).i32(4).op(OP.i32_mul).call(FN.alloc).set(posPtr);
          b.get(vPtr).op(OP.i32_eqz).get(posPtr).op(OP.i32_eqz).op(OP.i32_or).if_(() => {
            for (let off = 0; off < 32; off += 4) b.get(7).f32(0).storeF32(off);
            b.get(mark).gset(0);
            b.get(finalCount).op(OP.ret);
          });
          b.i32(0).set(k);
          b.i32(0).set(i);
          b.whileLoop(
            () => b.get(i).get(finalCount).op(OP.i32_lt_s),
            () => {
              b.get(bufPtr).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(f0);
              b.get(f0).f32(0).op(OP.f32_gt).if_(() => {
                b.get(vPtr).get(k).i32(4).op(OP.i32_mul).op(OP.i32_add).get(f0).storeF32();
                b.get(posPtr).get(k).i32(4).op(OP.i32_mul).op(OP.i32_add).get(i).op(OP.f32_convert_i32_s).storeF32();
                b.get(k).i32(1).op(OP.i32_add).set(k);
              });
              b.get(i).i32(1).op(OP.i32_add).set(i);
            }
          );

          b.f64(0).set(sumHz);
          b.get(vPtr).loadF32().tee(minHz).set(maxHz);
          b.i32(0).set(minIdx);
          b.i32(0).set(i);
          b.whileLoop(
            () => b.get(i).get(voicedCount).op(OP.i32_lt_s),
            () => {
              b.get(vPtr).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(v);
              b.get(v).op(OP.f64_promote_f32).get(sumHz).op(OP.f64_add).set(sumHz);
              b.get(v).get(minHz).op(OP.f32_lt).if_(() => {
                b.get(v).set(minHz);
                b.get(i).set(minIdx);
              });
              b.get(v).get(maxHz).op(OP.f32_gt).if_(() => b.get(v).set(maxHz));
              b.get(i).i32(1).op(OP.i32_add).set(i);
            }
          );
          b.get(sumHz).get(voicedCount).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f32_demote_f64).set(meanHz);

          b.get(posPtr).loadF32().set(t0);
          b.get(posPtr).get(voicedCount).i32(1).op(OP.i32_sub).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(t1);
          b.get(t1).get(t0).op(OP.f32_gt).if_(
            () => b.get(t1).get(t0).op(OP.f32_sub).set(tSpan),
            () => b.f32(1.0).set(tSpan)
          );

          b.f64(0).set(varHz);
          b.f64(0).set(varSemi);
          b.f64(0).set(sumU);
          b.f64(0).set(sumS);
          b.f64(0).set(sumUU);
          b.f64(0).set(sumUS);

          b.i32(0).set(i);
          b.whileLoop(
            () => b.get(i).get(voicedCount).op(OP.i32_lt_s),
            () => {
              b.get(vPtr).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().set(v);
              b.get(v).get(meanHz).op(OP.f32_sub).op(OP.f64_promote_f32).tee(dh).get(dh).op(OP.f64_mul).get(varHz).op(OP.f64_add).set(varHz);
              // semi = 12 * log2(v / meanHz) = 12 * 1.44269504 * ln(v / meanHz)
              b.get(v).get(meanHz).op(OP.f32_div).call(FN.lnF32).f32(12.0 * 1.44269504).op(OP.f32_mul).op(OP.f64_promote_f32).set(semi);
              b.get(semi).get(semi).op(OP.f64_mul).get(varSemi).op(OP.f64_add).set(varSemi);
              b.get(posPtr).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().get(t0).op(OP.f32_sub).get(tSpan).op(OP.f32_div).op(OP.f64_promote_f32).set(u);
              b.get(sumU).get(u).op(OP.f64_add).set(sumU);
              b.get(sumS).get(semi).op(OP.f64_add).set(sumS);
              b.get(sumUU).get(u).get(u).op(OP.f64_mul).op(OP.f64_add).set(sumUU);
              b.get(sumUS).get(u).get(semi).op(OP.f64_mul).op(OP.f64_add).set(sumUS);
              b.get(i).i32(1).op(OP.i32_add).set(i);
            }
          );

          b.get(varHz).get(voicedCount).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f64_sqrt).op(OP.f32_demote_f64).set(stdHz);
          b.get(varSemi).get(voicedCount).op(OP.f64_convert_i32_s).op(OP.f64_div).op(OP.f64_sqrt).op(OP.f32_demote_f64).set(stdSemi);

          b.get(voicedCount).op(OP.f64_convert_i32_s).get(sumUU).op(OP.f64_mul).get(sumU).get(sumU).op(OP.f64_mul).op(OP.f64_sub).set(denom);
          b.get(denom).f64(1e-6).op(OP.f64_gt).if_(
            () => {
              b.get(voicedCount).op(OP.f64_convert_i32_s).get(sumUS).op(OP.f64_mul).get(sumU).get(sumS).op(OP.f64_mul).op(OP.f64_sub)
                .get(denom).op(OP.f64_div).op(OP.f32_demote_f64).set(slopeSemi);
            },
            () => b.f32(0).set(slopeSemi)
          );

          b.get(posPtr).get(minIdx).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().get(t0).op(OP.f32_sub).get(tSpan).op(OP.f32_div).set(turnPos);

          b.get(voicedCount).i32(5).op(OP.i32_div_s).set(edge);
          b.get(edge).i32(1).op(OP.i32_lt_s).if_(() => b.i32(1).set(edge));
          b.f32(0).tee(startHz).set(endHz);
          b.i32(0).set(i);
          b.whileLoop(
            () => b.get(i).get(edge).op(OP.i32_lt_s),
            () => {
              b.get(vPtr).get(i).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().get(startHz).op(OP.f32_add).set(startHz);
              b.get(vPtr).get(voicedCount).i32(1).op(OP.i32_sub).get(i).op(OP.i32_sub).i32(4).op(OP.i32_mul).op(OP.i32_add).loadF32().get(endHz).op(OP.f32_add).set(endHz);
              b.get(i).i32(1).op(OP.i32_add).set(i);
            }
          );
          b.get(startHz).get(edge).op(OP.f32_convert_i32_s).op(OP.f32_div).set(startHz);
          b.get(endHz).get(edge).op(OP.f32_convert_i32_s).op(OP.f32_div).set(endHz);
          b.get(startHz).get(endHz).op(OP.f32_min).set(lowEdge);

          b.get(minHz).f32(0).op(OP.f32_gt).get(lowEdge).get(minHz).op(OP.f32_gt).op(OP.i32_and).if_(
            () => b.get(lowEdge).get(minHz).op(OP.f32_div).call(FN.lnF32).f32(12.0 * 1.44269504).op(OP.f32_mul).set(dipSemi),
            () => b.f32(0).set(dipSemi)
          );

          // Phân loại Thanh 1..4
          b.get(dipSemi).f32(1.8).op(OP.f32_ge).get(turnPos).f32(0.20).op(OP.f32_ge).op(OP.i32_and).get(turnPos).f32(0.85).op(OP.f32_le).op(OP.i32_and).if_(
            () => b.f32(3.0).set(toneClass),
            () => {
              b.get(slopeSemi).f32(2.2).op(OP.f32_ge).if_(
                () => b.f32(2.0).set(toneClass),
                () => {
                  b.get(slopeSemi).f32(-2.2).op(OP.f32_le).if_(
                    () => b.f32(4.0).set(toneClass),
                    () => {
                      b.get(slopeSemi).op(OP.f32_abs).f32(2.2).op(OP.f32_lt).get(stdSemi).f32(1.8).op(OP.f32_lt).op(OP.i32_and).if_(
                        () => b.f32(1.0).set(toneClass),
                        () => {
                          b.get(slopeSemi).f32(0).op(OP.f32_gt).if_(
                            () => b.f32(2.0).set(toneClass),
                            () => b.f32(4.0).set(toneClass)
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );

          b.get(7).get(meanHz).storeF32(0);
          b.get(7).get(stdHz).storeF32(4);
          b.get(7).get(stdSemi).storeF32(8);
          b.get(7).get(minHz).storeF32(12);
          b.get(7).get(maxHz).storeF32(16);
          b.get(7).get(slopeSemi).storeF32(20);
          b.get(7).get(turnPos).storeF32(24);
          b.get(7).get(toneClass).storeF32(28);
        }
      );
    });

    b.get(mark).gset(0);
    b.get(finalCount);
  }, 'wasm_extract_pitch_contour');

  // 13. wasm_levenshtein_u16(ptr_a: i32, len_a: i32, ptr_b: i32, len_b: i32) -> i32
  mod.addFunc('wasm_levenshtein_u16', [I32, I32, I32, I32], [I32], (b) => {
    const ptrA = b.local(I32);
    const lenA = b.local(I32);
    const ptrB = b.local(I32);
    const lenB = b.local(I32);
    const mark = b.local(I32);
    const dpPtr = b.local(I32);
    const i = b.local(I32);
    const j = b.local(I32);
    const prevDiag = b.local(I32);
    const ca = b.local(I32);
    const cb = b.local(I32);
    const oldDpJ = b.local(I32);
    const cost = b.local(I32);
    const best = b.local(I32);
    const dpJAddr = b.local(I32);
    const ans = b.local(I32);

    b.get(1).i32(0).op(OP.i32_le_s).if_(() => {
      b.get(3).i32(0).op(OP.i32_gt_s).if_(() => b.get(3), () => b.i32(0), I32).op(OP.ret);
    });
    b.get(3).i32(0).op(OP.i32_le_s).if_(() => {
      b.get(1).op(OP.ret);
    });
    b.get(0).op(OP.i32_eqz).get(2).op(OP.i32_eqz).op(OP.i32_or).if_(() => {
      b.get(1).get(3).op(OP.i32_gt_s).if_(() => b.get(1), () => b.get(3), I32).op(OP.ret);
    });

    b.get(1).get(3).op(OP.i32_ge_s).if_(
      () => {
        b.get(0).set(ptrA); b.get(1).set(lenA);
        b.get(2).set(ptrB); b.get(3).set(lenB);
      },
      () => {
        b.get(2).set(ptrA); b.get(3).set(lenA);
        b.get(0).set(ptrB); b.get(1).set(lenB);
      }
    );

    b.gget(0).set(mark);
    b.get(lenB).i32(1).op(OP.i32_add).i32(4).op(OP.i32_mul).call(FN.alloc).set(dpPtr);
    b.get(dpPtr).op(OP.i32_eqz).if_(() => {
      b.get(mark).gset(0);
      b.get(lenA).op(OP.ret);
    });

    b.i32(0).set(j);
    b.whileLoop(
      () => b.get(j).get(lenB).op(OP.i32_le_s),
      () => {
        b.get(dpPtr).get(j).i32(4).op(OP.i32_mul).op(OP.i32_add).get(j).storeI32();
        b.get(j).i32(1).op(OP.i32_add).set(j);
      }
    );

    b.i32(1).set(i);
    b.whileLoop(
      () => b.get(i).get(lenA).op(OP.i32_le_s),
      () => {
        b.get(dpPtr).loadI32().set(prevDiag);
        b.get(dpPtr).get(i).storeI32();
        b.get(ptrA).get(i).i32(1).op(OP.i32_sub).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().set(ca);

        b.i32(1).set(j);
        b.whileLoop(
          () => b.get(j).get(lenB).op(OP.i32_le_s),
          () => {
            b.get(dpPtr).get(j).i32(4).op(OP.i32_mul).op(OP.i32_add).set(dpJAddr);
            b.get(dpJAddr).loadI32().set(oldDpJ);
            b.get(ptrB).get(j).i32(1).op(OP.i32_sub).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().set(cb);
            b.get(ca).get(cb).op(OP.i32_eq).if_(
              () => b.i32(0).set(cost),
              () => b.i32(1).set(cost)
            );
            // best = min(oldDpJ + 1, dp[j-1] + 1, prevDiag + cost)
            b.get(oldDpJ).i32(1).op(OP.i32_add).set(best);
            b.get(dpJAddr).i32(4).op(OP.i32_sub).loadI32().i32(1).op(OP.i32_add).set(cb);
            b.get(cb).get(best).op(OP.i32_lt_s).if_(() => b.get(cb).set(best));
            b.get(prevDiag).get(cost).op(OP.i32_add).set(cb);
            b.get(cb).get(best).op(OP.i32_lt_s).if_(() => b.get(cb).set(best));
            b.get(dpJAddr).get(best).storeI32();
            b.get(oldDpJ).set(prevDiag);
            b.get(j).i32(1).op(OP.i32_add).set(j);
          }
        );
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );

    b.get(dpPtr).get(lenB).i32(4).op(OP.i32_mul).op(OP.i32_add).loadI32().set(ans);
    b.get(mark).gset(0);
    b.get(ans);
  }, 'wasm_levenshtein_u16');

  // 14. wasm_lcs_u16(ptr_a: i32, len_a: i32, ptr_b: i32, len_b: i32) -> i32
  mod.addFunc('wasm_lcs_u16', [I32, I32, I32, I32], [I32], (b) => {
    const ptrA = b.local(I32);
    const lenA = b.local(I32);
    const ptrB = b.local(I32);
    const lenB = b.local(I32);
    const mark = b.local(I32);
    const dpPtr = b.local(I32);
    const i = b.local(I32);
    const j = b.local(I32);
    const prevDiag = b.local(I32);
    const ca = b.local(I32);
    const cb = b.local(I32);
    const oldDpJ = b.local(I32);
    const left = b.local(I32);
    const dpJAddr = b.local(I32);
    const ans = b.local(I32);

    b.get(0).op(OP.i32_eqz).get(2).op(OP.i32_eqz).op(OP.i32_or)
      .get(1).i32(0).op(OP.i32_le_s).op(OP.i32_or)
      .get(3).i32(0).op(OP.i32_le_s).op(OP.i32_or).if_(() => {
        b.i32(0).op(OP.ret);
      });

    b.get(1).get(3).op(OP.i32_ge_s).if_(
      () => {
        b.get(0).set(ptrA); b.get(1).set(lenA);
        b.get(2).set(ptrB); b.get(3).set(lenB);
      },
      () => {
        b.get(2).set(ptrA); b.get(3).set(lenA);
        b.get(0).set(ptrB); b.get(1).set(lenB);
      }
    );

    b.gget(0).set(mark);
    b.get(lenB).i32(1).op(OP.i32_add).i32(4).op(OP.i32_mul).call(FN.alloc).set(dpPtr);
    b.get(dpPtr).op(OP.i32_eqz).if_(() => {
      b.get(mark).gset(0);
      b.i32(0).op(OP.ret);
    });

    b.i32(0).set(j);
    b.whileLoop(
      () => b.get(j).get(lenB).op(OP.i32_le_s),
      () => {
        b.get(dpPtr).get(j).i32(4).op(OP.i32_mul).op(OP.i32_add).i32(0).storeI32();
        b.get(j).i32(1).op(OP.i32_add).set(j);
      }
    );

    b.i32(1).set(i);
    b.whileLoop(
      () => b.get(i).get(lenA).op(OP.i32_le_s),
      () => {
        b.i32(0).set(prevDiag);
        b.get(ptrA).get(i).i32(1).op(OP.i32_sub).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().set(ca);

        b.i32(1).set(j);
        b.whileLoop(
          () => b.get(j).get(lenB).op(OP.i32_le_s),
          () => {
            b.get(dpPtr).get(j).i32(4).op(OP.i32_mul).op(OP.i32_add).set(dpJAddr);
            b.get(dpJAddr).loadI32().set(oldDpJ);
            b.get(ptrB).get(j).i32(1).op(OP.i32_sub).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().set(cb);
            b.get(ca).get(cb).op(OP.i32_eq).if_(
              () => b.get(dpJAddr).get(prevDiag).i32(1).op(OP.i32_add).storeI32(),
              () => {
                b.get(dpJAddr).i32(4).op(OP.i32_sub).loadI32().set(left);
                b.get(left).get(oldDpJ).op(OP.i32_gt_s).if_(() => {
                  b.get(dpJAddr).get(left).storeI32();
                });
              }
            );
            b.get(oldDpJ).set(prevDiag);
            b.get(j).i32(1).op(OP.i32_add).set(j);
          }
        );
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );

    b.get(dpPtr).get(lenB).i32(4).op(OP.i32_mul).op(OP.i32_add).loadI32().set(ans);
    b.get(mark).gset(0);
    b.get(ans);
  }, 'wasm_lcs_u16');

  // 15. find_subslice_folded(hay_ptr, hay_len, needle_ptr, needle_len) -> i32
  mod.addFunc('find_subslice_folded', [I32, I32, I32, I32], [I32], (b) => {
    const limit = b.local(I32);
    const i = b.local(I32);
    const j = b.local(I32);
    const ok = b.local(I32);
    const ch = b.local(I32);
    const cn = b.local(I32);

    b.get(3).i32(0).op(OP.i32_le_s).get(3).get(1).op(OP.i32_gt_s).op(OP.i32_or).if_(() => {
      b.i32(-1).op(OP.ret);
    });
    b.get(1).get(3).op(OP.i32_sub).set(limit);
    b.i32(0).set(i);
    b.whileLoop(
      () => b.get(i).get(limit).op(OP.i32_le_s),
      () => {
        b.i32(1).set(ok);
        b.i32(0).set(j);
        b.whileLoop(
          () => b.get(j).get(3).op(OP.i32_lt_s).get(ok).op(OP.i32_and),
          () => {
            b.get(0).get(i).get(j).op(OP.i32_add).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().set(ch);
            b.get(ch).i32(65).op(OP.i32_ge_s).get(ch).i32(90).op(OP.i32_le_s).op(OP.i32_and).if_(() => {
              b.get(ch).i32(32).op(OP.i32_add).set(ch);
            });
            b.get(2).get(j).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().set(cn);
            b.get(cn).i32(65).op(OP.i32_ge_s).get(cn).i32(90).op(OP.i32_le_s).op(OP.i32_and).if_(() => {
              b.get(cn).i32(32).op(OP.i32_add).set(cn);
            });
            b.get(ch).get(cn).op(OP.i32_ne).if_(() => b.i32(0).set(ok));
            b.get(j).i32(1).op(OP.i32_add).set(j);
          }
        );
        b.get(ok).if_(() => { b.get(i).op(OP.ret); });
        b.get(i).i32(1).op(OP.i32_add).set(i);
      }
    );
    b.i32(-1);
  });

  // 16. is_sep_u16(c: i32) -> i32
  mod.addFunc('is_sep_u16', [I32], [I32], (b) => {
    const c = b.param(0);
    b.get(c).i32(32).op(OP.i32_eq)
      .get(c).i32(9).op(OP.i32_eq).op(OP.i32_or)
      .get(c).i32(10).op(OP.i32_eq).op(OP.i32_or)
      .get(c).i32(13).op(OP.i32_eq).op(OP.i32_or).if_(() => {
        b.i32(1).op(OP.ret);
      });
    b.get(c).i32(128).op(OP.i32_lt_s).if_(() => {
      // Giữ lại chữ số, chữ cái ASCII và dấu nháy đơn (')
      b.get(c).i32(48).op(OP.i32_ge_s).get(c).i32(57).op(OP.i32_le_s).op(OP.i32_and)
        .get(c).i32(65).op(OP.i32_ge_s).get(c).i32(90).op(OP.i32_le_s).op(OP.i32_and).op(OP.i32_or)
        .get(c).i32(97).op(OP.i32_ge_s).get(c).i32(122).op(OP.i32_le_s).op(OP.i32_and).op(OP.i32_or)
        .get(c).i32(39).op(OP.i32_eq).op(OP.i32_or)
        .op(OP.i32_eqz).op(OP.ret);
    });
    b.i32(0);
  });

  // 17. wasm_fuzzy_token_score(q_ptr, q_len, doc_ptr, doc_len) -> i32
  mod.addFunc('wasm_fuzzy_token_score', [I32, I32, I32, I32], [I32], (b) => {
    const phraseScore = b.local(I32);
    const pos = b.local(I32);
    const totalTokens = b.local(I32);
    const matchedTokens = b.local(I32);
    const tokenScoreSum = b.local(I32);
    const qi = b.local(I32);
    const qStart = b.local(I32);
    const qtLen = b.local(I32);
    const bestTok = b.local(I32);
    const di = b.local(I32);
    const dStart = b.local(I32);
    const dtLen = b.local(I32);
    const subPos = b.local(I32);
    const s = b.local(I32);
    const pen = b.local(I32);
    const dist = b.local(I32);
    const maxDist = b.local(I32);
    const lenDiff = b.local(I32);
    const tokenScore = b.local(I32);
    const avg = b.local(I32);

    b.get(0).op(OP.i32_eqz).get(2).op(OP.i32_eqz).op(OP.i32_or)
      .get(1).i32(0).op(OP.i32_le_s).op(OP.i32_or)
      .get(3).i32(0).op(OP.i32_le_s).op(OP.i32_or).if_(() => {
        b.i32(0).op(OP.ret);
      });

    b.get(2).get(3).get(0).get(1).call(FN.findSubslice).set(pos);
    b.get(1).get(3).op(OP.i32_eq).get(pos).i32(0).op(OP.i32_eq).op(OP.i32_and).if_(() => {
      b.i32(1000).op(OP.ret);
    });

    b.i32(0).set(phraseScore);
    b.get(pos).i32(0).op(OP.i32_eq).if_(
      () => b.i32(940).set(phraseScore),
      () => {
        b.get(pos).i32(0).op(OP.i32_gt_s).if_(() => {
          b.get(2).get(pos).i32(1).op(OP.i32_sub).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().call(FN.isSepU16).if_(
            () => b.i32(880).set(phraseScore),
            () => b.i32(780).set(phraseScore)
          );
        });
      }
    );

    b.i32(0).set(totalTokens);
    b.i32(0).set(matchedTokens);
    b.i32(0).set(tokenScoreSum);
    b.i32(0).set(qi);

    b.whileLoop(
      () => b.get(qi).get(1).op(OP.i32_lt_s),
      () => {
        b.whileLoop(
          () => {
            b.get(qi).get(1).op(OP.i32_lt_s).if_(
              () => b.get(0).get(qi).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().call(FN.isSepU16),
              () => b.i32(0),
              I32
            );
          },
          () => b.get(qi).i32(1).op(OP.i32_add).set(qi)
        );
        b.get(qi).get(1).op(OP.i32_ge_s).if_(() => { b.br(1); });

        b.get(qi).set(qStart);
        b.whileLoop(
          () => {
            b.get(qi).get(1).op(OP.i32_lt_s).if_(
              () => b.get(0).get(qi).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().call(FN.isSepU16).op(OP.i32_eqz),
              () => b.i32(0),
              I32
            );
          },
          () => b.get(qi).i32(1).op(OP.i32_add).set(qi)
        );

        b.get(qi).get(qStart).op(OP.i32_sub).set(qtLen);
        b.get(totalTokens).i32(1).op(OP.i32_add).set(totalTokens);

        b.i32(0).set(bestTok);
        b.i32(0).set(di);
        b.whileLoop(
          () => b.get(di).get(3).op(OP.i32_lt_s),
          () => {
            b.whileLoop(
              () => {
                b.get(di).get(3).op(OP.i32_lt_s).if_(
                  () => b.get(2).get(di).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().call(FN.isSepU16),
                  () => b.i32(0),
                  I32
                );
              },
              () => b.get(di).i32(1).op(OP.i32_add).set(di)
            );
            b.get(di).get(3).op(OP.i32_ge_s).if_(() => { b.br(1); });

            b.get(di).set(dStart);
            b.whileLoop(
              () => {
                b.get(di).get(3).op(OP.i32_lt_s).if_(
                  () => b.get(2).get(di).i32(2).op(OP.i32_mul).op(OP.i32_add).loadU16().call(FN.isSepU16).op(OP.i32_eqz),
                  () => b.i32(0),
                  I32
                );
              },
              () => b.get(di).i32(1).op(OP.i32_add).set(di)
            );

            b.get(di).get(dStart).op(OP.i32_sub).set(dtLen);
            b.get(2).get(dStart).i32(2).op(OP.i32_mul).op(OP.i32_add).get(dtLen)
              .get(0).get(qStart).i32(2).op(OP.i32_mul).op(OP.i32_add).get(qtLen)
              .call(FN.findSubslice).set(subPos);

            b.i32(0).set(s);
            b.get(subPos).i32(0).op(OP.i32_eq).if_(
              () => {
                b.get(dtLen).get(qtLen).op(OP.i32_eq).if_(
                  () => b.i32(1000).set(s),
                  () => {
                    b.get(dtLen).get(qtLen).op(OP.i32_sub).i32(8).op(OP.i32_mul).set(pen);
                    b.get(pen).i32(80).op(OP.i32_gt_s).if_(() => b.i32(80).set(pen));
                    b.i32(900).get(pen).op(OP.i32_sub).set(s);
                  }
                );
              },
              () => {
                b.get(subPos).i32(0).op(OP.i32_gt_s).if_(
                  () => {
                    b.get(subPos).i32(10).op(OP.i32_mul).set(pen);
                    b.get(pen).i32(80).op(OP.i32_gt_s).if_(() => b.i32(80).set(pen));
                    b.i32(760).get(pen).op(OP.i32_sub).set(s);
                  },
                  () => {
                    b.get(qtLen).i32(3).op(OP.i32_ge_s).get(dtLen).i32(2).op(OP.i32_ge_s).op(OP.i32_and).if_(() => {
                      b.get(qtLen).i32(4).op(OP.i32_le_s).if_(
                        () => b.i32(1).set(maxDist),
                        () => b.i32(2).set(maxDist)
                      );
                      b.get(dtLen).get(qtLen).op(OP.i32_sub).set(lenDiff);
                      b.get(lenDiff).i32(0).op(OP.i32_lt_s).if_(() => b.i32(0).get(lenDiff).op(OP.i32_sub).set(lenDiff));
                      b.get(lenDiff).get(maxDist).op(OP.i32_le_s).if_(() => {
                        b.get(0).get(qStart).i32(2).op(OP.i32_mul).op(OP.i32_add).get(qtLen)
                          .get(2).get(dStart).i32(2).op(OP.i32_mul).op(OP.i32_add).get(dtLen)
                          .call(FN.levenshteinU16).set(dist);
                        b.get(dist).get(maxDist).op(OP.i32_le_s).if_(() => {
                          b.i32(820).get(dist).i32(160).op(OP.i32_mul).op(OP.i32_sub).get(lenDiff).i32(20).op(OP.i32_mul).op(OP.i32_sub).set(s);
                          b.get(s).i32(450).op(OP.i32_lt_s).if_(() => b.i32(450).set(s));
                        });
                      });
                    });
                  }
                );
              }
            );

            b.get(s).get(bestTok).op(OP.i32_gt_s).if_(() => {
              b.get(s).set(bestTok);
            });
            b.get(bestTok).i32(1000).op(OP.i32_eq).if_(() => { b.br(1); });
          }
        );

        b.get(bestTok).i32(0).op(OP.i32_gt_s).if_(() => {
          b.get(matchedTokens).i32(1).op(OP.i32_add).set(matchedTokens);
          b.get(tokenScoreSum).get(bestTok).op(OP.i32_add).set(tokenScoreSum);
        });
      }
    );

    b.i32(0).set(tokenScore);
    b.get(totalTokens).i32(0).op(OP.i32_gt_s).get(matchedTokens).i32(0).op(OP.i32_gt_s).op(OP.i32_and).if_(() => {
      b.get(tokenScoreSum).get(totalTokens).op(OP.i32_div_s).set(avg);
      b.get(matchedTokens).get(totalTokens).op(OP.i32_eq).if_(
        () => b.get(avg).set(tokenScore),
        () => b.get(avg).get(matchedTokens).op(OP.i32_mul).i32(6).op(OP.i32_mul).get(totalTokens).i32(10).op(OP.i32_mul).op(OP.i32_div_s).set(tokenScore)
      );
    });

    b.get(phraseScore).get(tokenScore).op(OP.i32_gt_s).if_(
      () => b.get(phraseScore).set(s),
      () => b.get(tokenScore).set(s)
    );
    b.get(s).i32(1000).op(OP.i32_gt_s).if_(() => b.i32(1000).set(s));
    b.get(s);
  }, 'wasm_fuzzy_token_score');

  return mod.build();
}

function writeU16(mem, str) {
  const ptr = mem.alloc(str.length * 2);
  const view = new Uint16Array(mem.buffer(), ptr, str.length);
  for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);
  return { ptr, len: str.length };
}

function makeSine(n, sr, freqFn, amp = 0.4, dc = 0.0) {
  const arr = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const f = typeof freqFn === 'function' ? freqFn(i / n, i) : freqFn;
    phase += (2 * Math.PI * f) / sr;
    arr[i] = dc + amp * Math.sin(phase);
  }
  return arr;
}

async function runTests(wasmBytes) {
  assert(WebAssembly.validate(wasmBytes), 'WebAssembly.validate phải trả về true');
  const { instance } = await WebAssembly.instantiate(wasmBytes);
  const ex = instance.exports;
  const memHelper = {
    buffer: () => ex.memory.buffer,
    alloc: (bytes) => ex.wasm_alloc(bytes)
  };

  // Test 1: High-pass DC removal & Soft-limit Normalization
  ex.wasm_reset_heap();
  const sr = 16000;
  const rawAudio = makeSine(1600, sr, 220, 0.08, 0.25); // có DC offset 0.25
  const audioPtr = ex.wasm_alloc(rawAudio.length * 4);
  const statsPtr = ex.wasm_alloc(16);
  new Float32Array(ex.memory.buffer, audioPtr, rawAudio.length).set(rawAudio);
  const filtRms = ex.wasm_highpass_dc_rms(audioPtr, rawAudio.length, sr, statsPtr);
  const stats = new Float32Array(ex.memory.buffer, statsPtr, 4);
  assert(Math.abs(stats[0] - 0.08 / Math.SQRT2) < 0.01, `rawRms sau khử DC lệch: ${stats[0]}`);
  assert(filtRms > 0.04 && filtRms < 0.08, `filteredRms bất thường: ${filtRms}`);
  const normRms = ex.wasm_normalize_softlimit(audioPtr, rawAudio.length, 0.85, 14.0);
  const normArr = new Float32Array(ex.memory.buffer, audioPtr, rawAudio.length);
  let normPeak = 0;
  for (let i = 0; i < normArr.length; i++) normPeak = Math.max(normPeak, Math.abs(normArr[i]));
  assert(normRms > 0.35 && normPeak <= 0.995, `normRms=${normRms}, normPeak=${normPeak}`);
  // Kiểm tra soft-limiter với tín hiệu biên độ cao (amplitude 2.0) bị nén êm dưới 0.995
  const loud = makeSine(800, sr, 220, 2.0, 0);
  const loudPtr = ex.wasm_alloc(loud.length * 4);
  new Float32Array(ex.memory.buffer, loudPtr, loud.length).set(loud);
  ex.wasm_normalize_softlimit(loudPtr, loud.length, 0.85, 14.0);
  const loudOut = new Float32Array(ex.memory.buffer, loudPtr, loud.length);
  let loudPeak = 0;
  for (let i = 0; i < loudOut.length; i++) loudPeak = Math.max(loudPeak, Math.abs(loudOut[i]));
  assert(loudPeak > 0.90 && loudPeak <= 0.995, `Soft limiter thất bại: loudPeak=${loudPeak}`);

  // Test 2: VAD Analysis (khoảng lặng đầu/cuối + 2 khoảng nghỉ giữa câu >= 240ms và >= 600ms)
  ex.wasm_reset_heap();
  // 0.3s lặng + 0.5s nói + 0.3s nghỉ (1 pause) + 0.5s nói + 0.7s nghỉ (1 pause + 1 long pause) + 0.5s nói + 0.3s lặng = 3.1s (49600 samples)
  const vadBuf = new Float32Array(49600);
  const seg1 = makeSine(8000, sr, 180, 0.25);
  const seg2 = makeSine(8000, sr, 200, 0.25);
  const seg3 = makeSine(8000, sr, 190, 0.25);
  vadBuf.set(seg1, 4800);
  vadBuf.set(seg2, 4800 + 8000 + 4800);
  vadBuf.set(seg3, 4800 + 8000 + 4800 + 8000 + 11200);
  const vadPtr = ex.wasm_alloc(vadBuf.length * 4);
  const metaPtr = ex.wasm_alloc(32);
  new Float32Array(ex.memory.buffer, vadPtr, vadBuf.length).set(vadBuf);
  const trimmedLen = ex.wasm_vad_analyze(vadPtr, vadBuf.length, 320, 8, metaPtr);
  const meta = new Int32Array(ex.memory.buffer, metaPtr, 8);
  assert(meta[0] >= 1600 && meta[0] <= 4800, `startSample không khớp: ${meta[0]}`);
  assert(meta[1] >= 44800 && meta[1] <= 48000, `endSample không khớp: ${meta[1]}`);
  assert(meta[4] === 2, `pauseCount phải là 2, nhận ${meta[4]}`);
  assert(meta[5] === 1, `longPauseCount phải là 1, nhận ${meta[5]}`);
  assert(meta[6] > 2000, `SNR quá thấp: ${meta[6]}`);
  assert(trimmedLen === meta[1] - meta[0], 'trimmedLen phải bằng end - start');

  // Test 3: YIN Pitch Detection (220.0 Hz, sai số < 1.5 Hz) & 4 Thanh điệu tiếng Trung
  ex.wasm_reset_heap();
  const sine220 = makeSine(1024, sr, 220.0, 0.4);
  const s220Ptr = ex.wasm_alloc(sine220.length * 4);
  new Float32Array(ex.memory.buffer, s220Ptr, sine220.length).set(sine220);
  const detectedF0 = ex.wasm_detect_pitch_yin(s220Ptr, sine220.length, sr, 65.0, 500.0);
  assert(Math.abs(detectedF0 - 220.0) < 1.5, `YIN 220Hz sai số lớn: ${detectedF0}`);

  const toneConfigs = [
    { tone: 1, fn: () => 235 },
    { tone: 2, fn: (t) => 150 + 85 * t },
    { tone: 3, fn: (t) => 170 - 60 * Math.sin(Math.PI * t) },
    { tone: 4, fn: (t) => 265 - 125 * t }
  ];
  for (const tc of toneConfigs) {
    ex.wasm_reset_heap();
    const tonePcm = makeSine(8000, sr, tc.fn, 0.35);
    const tPtr = ex.wasm_alloc(tonePcm.length * 4);
    const cPtr = ex.wasm_alloc(128 * 4);
    const sumPtr = ex.wasm_alloc(32);
    new Float32Array(ex.memory.buffer, tPtr, tonePcm.length).set(tonePcm);
    const pts = ex.wasm_extract_pitch_contour(tPtr, tonePcm.length, sr, 160, 640, cPtr, 128, sumPtr);
    const sum = new Float32Array(ex.memory.buffer, sumPtr, 8);
    assert(pts >= 30, `Contour quá ngắn: ${pts}`);
    assert(Math.round(sum[7]) === tc.tone, `Phân loại nhầm Thanh ${tc.tone}: nhận ${sum[7]} (slope=${sum[5].toFixed(2)})`);
  }

  // Test 4: Levenshtein, LCS & Fuzzy Token Score (Anh - Việt - Trung)
  ex.wasm_reset_heap();
  const a1 = writeU16(memHelper, 'environment');
  const b1 = writeU16(memHelper, 'enviroment');
  assert.strictEqual(ex.wasm_levenshtein_u16(a1.ptr, a1.len, b1.ptr, b1.len), 1, 'Levenshtein sai');

  const zhA = writeU16(memHelper, '我喜欢学习汉语');
  const zhB = writeU16(memHelper, '我爱学习中国话');
  assert.strictEqual(ex.wasm_lcs_u16(zhA.ptr, zhA.len, zhB.ptr, zhB.len), 3, 'LCS tiếng Trung phải là 3');

  const qEn = writeU16(memHelper, 'enviroment');
  const dEn = writeU16(memHelper, 'protect the natural environment today');
  const scoreEn = ex.wasm_fuzzy_token_score(qEn.ptr, qEn.len, dEn.ptr, dEn.len);
  assert(scoreEn >= 600, `Fuzzy English typo score quá thấp: ${scoreEn}`);

  const qVi = writeU16(memHelper, 'ngu phap');
  const dVi = writeU16(memHelper, 'tong hop ngu phap tieng anh ielts');
  const scoreVi = ex.wasm_fuzzy_token_score(qVi.ptr, qVi.len, dVi.ptr, dVi.len);
  assert(scoreVi >= 850, `Fuzzy Vietnamese score quá thấp: ${scoreVi}`);

  const qMiss = writeU16(memHelper, 'cat');
  const dMiss = writeU16(memHelper, 'quantum physics');
  assert.strictEqual(ex.wasm_fuzzy_token_score(qMiss.ptr, qMiss.len, dMiss.ptr, dMiss.len), 0, 'Từ không khớp phải = 0');

  return {
    bytes: wasmBytes.length,
    detectedF0: Number(detectedF0.toFixed(2)),
    vadMeta: Array.from(meta),
    scoreEn,
    scoreVi
  };
}

async function main() {
  const t0 = Date.now();
  const wasmBytes = buildCoreWasm();
  fs.mkdirSync(path.dirname(OUT_WASM), { recursive: true });
  fs.writeFileSync(OUT_WASM, wasmBytes);
  const report = await runTests(wasmBytes);
  const elapsed = Date.now() - t0;
  console.log(`[s4-core.wasm] Build & Unit Tests PASSED (${elapsed} ms)`);
  console.log(`  Output: ${OUT_WASM} (${report.bytes} bytes)`);
  console.log(`  YIN 220Hz = ${report.detectedF0} Hz | VAD meta = [${report.vadMeta.join(', ')}]`);
  console.log(`  Fuzzy score: EN=${report.scoreEn}/1000, VI=${report.scoreVi}/1000`);
}

main().catch((err) => {
  console.error('[s4-core.wasm] BUILD/TEST FAILED:', err);
  process.exit(1);
});
