#![no_std]

use core::panic::PanicInfo;
use core::slice;

const HEAP_BASE: usize = 65536;
static mut HEAP_PTR: usize = HEAP_BASE;

#[cfg(target_arch = "wasm32")]
use core::arch::wasm32;

#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}

// ============================================================================
// 1. QUẢN LÝ BỘ NHỚ ARENA
// ============================================================================

#[no_mangle]
pub extern "C" fn wasm_reset_heap() {
    unsafe {
        HEAP_PTR = HEAP_BASE;
    }
}

#[no_mangle]
pub extern "C" fn wasm_alloc(bytes: i32) -> i32 {
    let raw = if bytes <= 0 { 8usize } else { bytes as usize };
    let aligned = (raw + 7) & !7;
    unsafe {
        let ptr = HEAP_PTR;
        let next = ptr.saturating_add(aligned);
        #[cfg(target_arch = "wasm32")]
        {
            let cur_bytes = wasm32::memory_size(0) * 65536;
            if next > cur_bytes {
                let needed_pages = (next - cur_bytes + 65535) / 65536;
                if wasm32::memory_grow(0, needed_pages) == usize::MAX {
                    return 0;
                }
            }
        }
        HEAP_PTR = next;
        ptr as i32
    }
}

#[inline]
unsafe fn save_heap() -> usize {
    HEAP_PTR
}

#[inline]
unsafe fn restore_heap(mark: usize) {
    HEAP_PTR = mark;
}

// ============================================================================
// 2. HÀM TOÁN HỌC NỘI BỘ (#![no_std] KHÔNG PHỤ THUỘC LIBM)
// ============================================================================

#[inline]
fn abs_f32(x: f32) -> f32 {
    if x < 0.0 { -x } else { x }
}

#[inline]
fn clamp_f32(x: f32, lo: f32, hi: f32) -> f32 {
    if x < lo {
        lo
    } else if x > hi {
        hi
    } else {
        x
    }
}

#[inline]
fn round_i32(x: f32) -> i32 {
    if x >= 0.0 {
        (x + 0.5) as i32
    } else {
        (x - 0.5) as i32
    }
}

fn sqrt_f64(x: f64) -> f64 {
    if x <= 0.0 {
        return 0.0;
    }
    let mut g = f64::from_bits((x.to_bits() >> 1) + (0x3ff0_0000_0000_0000 >> 1));
    let mut i = 0;
    while i < 6 {
        g = 0.5 * (g + x / g);
        i += 1;
    }
    g
}

#[inline]
fn sqrt_f32(x: f32) -> f32 {
    sqrt_f64(x as f64) as f32
}

fn exp_f32(x: f32) -> f32 {
    let xc = clamp_f32(x, -40.0, 40.0);
    let ln2 = 0.6931471805599453_f64;
    let inv_ln2 = 1.4426950408889634_f64;
    let xd = xc as f64;
    let kf = if xd >= 0.0 {
        (xd * inv_ln2 + 0.5) as i32
    } else {
        (xd * inv_ln2 - 0.5) as i32
    };
    let r = xd - (kf as f64) * ln2;
    let r2 = r * r;
    let r3 = r2 * r;
    let r4 = r3 * r;
    let r5 = r4 * r;
    let r6 = r5 * r;
    let er = 1.0 + r + 0.5 * r2 + r3 / 6.0 + r4 / 24.0 + r5 / 120.0 + r6 / 720.0;
    let scale = if kf >= 0 {
        f64::from_bits(((1023 + kf as u64) & 0x7ff) << 52)
    } else {
        let exp_bits = 1023_i64 + (kf as i64);
        if exp_bits <= 0 {
            0.0
        } else {
            f64::from_bits((exp_bits as u64) << 52)
        }
    };
    (er * scale) as f32
}

#[inline]
fn tanh_f32(x: f32) -> f32 {
    if x > 10.0 {
        return 1.0;
    }
    if x < -10.0 {
        return -1.0;
    }
    let e2x = exp_f32(2.0 * x);
    (e2x - 1.0) / (e2x + 1.0)
}

fn ln_f32(x: f32) -> f32 {
    if x <= 0.0 {
        return -100.0;
    }
    let bits = (x as f64).to_bits();
    let exp = ((bits >> 52) & 0x7ff) as i32 - 1023;
    let mant = f64::from_bits((bits & 0x000f_ffff_ffff_ffff) | 0x3ff0_0000_0000_0000);
    // Đưa mant vào [sqrt(0.5), sqrt(2)] để hội tụ nhanh
    let (m, e) = if mant > 1.4142135623730951 {
        (mant * 0.5, exp + 1)
    } else {
        (mant, exp)
    };
    let y = (m - 1.0) / (m + 1.0);
    let y2 = y * y;
    let ln_m = 2.0 * y * (1.0 + y2 / 3.0 + (y2 * y2) / 5.0 + (y2 * y2 * y2) / 7.0 + (y2 * y2 * y2 * y2) / 9.0);
    (ln_m + (e as f64) * 0.6931471805599453) as f32
}

#[inline]
fn log2_f32(x: f32) -> f32 {
    ln_f32(x) * 1.44269504_f32
}

#[inline]
fn log10_f32(x: f32) -> f32 {
    ln_f32(x) * 0.43429448_f32
}

fn heapsort_f32(arr: &mut [f32]) {
    let n = arr.len();
    if n < 2 {
        return;
    }
    let mut start = n / 2;
    while start > 0 {
        start -= 1;
        sift_down(arr, start, n);
    }
    let mut end = n;
    while end > 1 {
        end -= 1;
        arr.swap(0, end);
        sift_down(arr, 0, end);
    }
}

fn sift_down(arr: &mut [f32], mut root: usize, end: usize) {
    loop {
        let child = root * 2 + 1;
        if child >= end {
            break;
        }
        let mut swap_idx = root;
        if arr[swap_idx] < arr[child] {
            swap_idx = child;
        }
        if child + 1 < end && arr[swap_idx] < arr[child + 1] {
            swap_idx = child + 1;
        }
        if swap_idx == root {
            break;
        }
        arr.swap(root, swap_idx);
        root = swap_idx;
    }
}

// ============================================================================
// 3. XỬ LÝ TÍN HIỆU ÂM THANH DSP (PCM f32 16kHz)
// ============================================================================

#[no_mangle]
pub extern "C" fn wasm_highpass_dc_rms(
    ptr: i32,
    len: i32,
    sample_rate: f32,
    out_stats_ptr: i32,
) -> f32 {
    if ptr == 0 || len <= 0 {
        if out_stats_ptr != 0 {
            let out = unsafe { slice::from_raw_parts_mut(out_stats_ptr as *mut f32, 4) };
            out[0] = 0.0;
            out[1] = 0.0;
            out[2] = 0.0;
            out[3] = 0.0;
        }
        return 0.0;
    }

    let n = len as usize;
    let samples = unsafe { slice::from_raw_parts_mut(ptr as *mut f32, n) };

    let mut sum = 0.0_f64;
    for &s in samples.iter() {
        sum += s as f64;
    }
    let mean = (sum / (n as f64)) as f32;

    let mut raw_sum_sq = 0.0_f64;
    let mut raw_peak = 0.0_f32;
    for s in samples.iter_mut() {
        let centered = *s - mean;
        *s = centered;
        let a = abs_f32(centered);
        if a > raw_peak {
            raw_peak = a;
        }
        raw_sum_sq += (centered as f64) * (centered as f64);
    }
    let raw_rms = sqrt_f64(raw_sum_sq / (n as f64)) as f32;

    let sr = if sample_rate > 0.0 { sample_rate } else { 16000.0 };
    let rc = 1.0_f64 / (2.0 * core::f64::consts::PI * 80.0);
    let dt = 1.0_f64 / (sr as f64);
    let alpha = (rc / (rc + dt)) as f32;

    if n >= 2 {
        let mut prev_in = samples[0];
        let mut prev_out = samples[0];
        for i in 1..n {
            let x = samples[i];
            let y = alpha * (prev_out + x - prev_in);
            prev_in = x;
            prev_out = y;
            samples[i] = y;
        }
    }

    let mut filt_sum_sq = 0.0_f64;
    let mut filt_peak = 0.0_f32;
    for &s in samples.iter() {
        let a = abs_f32(s);
        if a > filt_peak {
            filt_peak = a;
        }
        filt_sum_sq += (s as f64) * (s as f64);
    }
    let filt_rms = sqrt_f64(filt_sum_sq / (n as f64)) as f32;

    if out_stats_ptr != 0 {
        let out = unsafe { slice::from_raw_parts_mut(out_stats_ptr as *mut f32, 4) };
        out[0] = raw_rms;
        out[1] = raw_peak;
        out[2] = filt_rms;
        out[3] = filt_peak;
    }

    filt_rms
}

#[no_mangle]
pub extern "C" fn wasm_vad_analyze(
    ptr: i32,
    len: i32,
    frame_samples: i32,
    pad_frames: i32,
    out_meta_ptr: i32,
) -> i32 {
    let fs = if frame_samples > 0 { frame_samples as usize } else { 320 };
    let pad = if pad_frames >= 0 { pad_frames as usize } else { 0 };
    let n = if len > 0 { len as usize } else { 0 };
    let total_frames = n / fs;

    if ptr == 0 || n == 0 || total_frames < 3 {
        if out_meta_ptr != 0 {
            let out = unsafe { slice::from_raw_parts_mut(out_meta_ptr as *mut i32, 8) };
            out[0] = 0;
            out[1] = n as i32;
            out[2] = 0;
            out[3] = total_frames as i32;
            out[4] = 0;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
        }
        return n as i32;
    }

    let samples = unsafe { slice::from_raw_parts(ptr as *const f32, n) };
    let mark = unsafe { save_heap() };
    let rms_ptr = wasm_alloc((total_frames * 4) as i32) as *mut f32;
    let sorted_ptr = wasm_alloc((total_frames * 4) as i32) as *mut f32;
    if rms_ptr.is_null() || sorted_ptr.is_null() {
        unsafe { restore_heap(mark); }
        return n as i32;
    }

    let frame_rms = unsafe { slice::from_raw_parts_mut(rms_ptr, total_frames) };
    let sorted_rms = unsafe { slice::from_raw_parts_mut(sorted_ptr, total_frames) };

    for f in 0..total_frames {
        let base = f * fs;
        let mut sum_sq = 0.0_f64;
        for k in 0..fs {
            let s = samples[base + k] as f64;
            sum_sq += s * s;
        }
        let r = sqrt_f64(sum_sq / (fs as f64)) as f32;
        frame_rms[f] = r;
        sorted_rms[f] = r;
    }

    heapsort_f32(sorted_rms);
    let p20_idx = ((total_frames * 20) / 100).min(total_frames - 1);
    let noise_floor = sorted_rms[p20_idx];
    let vad_thresh = clamp_f32(noise_floor * 2.2, 0.0015, 0.012);

    let mut first_active: isize = -1;
    let mut last_active: isize = -1;
    let mut voiced_frames: i32 = 0;
    let mut voiced_sum_sq = 0.0_f64;

    for (i, &r) in frame_rms.iter().enumerate() {
        if r >= vad_thresh {
            if first_active == -1 {
                first_active = i as isize;
            }
            last_active = i as isize;
            voiced_frames += 1;
            voiced_sum_sq += (r as f64) * (r as f64);
        }
    }

    let pause_min_frames = ((240 * 16 + fs / 2) / fs).max(1);
    let long_pause_min_frames = ((600 * 16 + fs / 2) / fs).max(2);
    let mut pause_count: i32 = 0;
    let mut long_pause_count: i32 = 0;

    if first_active != -1 && last_active > first_active {
        let mut silent_run: usize = 0;
        for i in (first_active as usize)..=(last_active as usize) {
            if frame_rms[i] < vad_thresh {
                silent_run += 1;
            } else {
                if silent_run >= pause_min_frames {
                    pause_count += 1;
                }
                if silent_run >= long_pause_min_frames {
                    long_pause_count += 1;
                }
                silent_run = 0;
            }
        }
    }

    let (start_sample, end_sample) = if first_active == -1 {
        (0usize, n)
    } else {
        let sf = (first_active as usize).saturating_sub(pad);
        let ef = ((last_active as usize) + 1 + pad).min(total_frames);
        let ss = sf * fs;
        let es = if ef >= total_frames { n } else { ef * fs };
        (ss, es)
    };

    let snr_db_x100 = if voiced_frames > 0 {
        let speech_rms = sqrt_f64(voiced_sum_sq / (voiced_frames as f64)) as f32;
        let noise_ref = if noise_floor > 1e-5 { noise_floor } else { 1e-5 };
        let snr_db = clamp_f32(20.0 * log10_f32(speech_rms / noise_ref), -60.0, 90.0);
        round_i32(snr_db * 100.0)
    } else {
        0
    };

    if out_meta_ptr != 0 {
        let out = unsafe { slice::from_raw_parts_mut(out_meta_ptr as *mut i32, 8) };
        out[0] = start_sample as i32;
        out[1] = end_sample as i32;
        out[2] = voiced_frames;
        out[3] = total_frames as i32;
        out[4] = pause_count;
        out[5] = long_pause_count;
        out[6] = snr_db_x100;
        out[7] = round_i32(noise_floor * 100000.0);
    }

    unsafe { restore_heap(mark); }
    (end_sample - start_sample) as i32
}

#[no_mangle]
pub extern "C" fn wasm_normalize_softlimit(
    ptr: i32,
    len: i32,
    target_peak: f32,
    max_gain: f32,
) -> f32 {
    if ptr == 0 || len <= 0 {
        return 0.0;
    }
    let n = len as usize;
    let samples = unsafe { slice::from_raw_parts_mut(ptr as *mut f32, n) };

    let mut sum_sq = 0.0_f64;
    let mut peak = 0.0_f32;
    for &s in samples.iter() {
        let a = abs_f32(s);
        if a > peak {
            peak = a;
        }
        sum_sq += (s as f64) * (s as f64);
    }
    let rms = sqrt_f64(sum_sq / (n as f64)) as f32;

    let step = (n / 4000).max(1);
    let m_len = (n + step - 1) / step;
    let mark = unsafe { save_heap() };
    let mags_ptr = wasm_alloc((m_len * 4) as i32) as *mut f32;
    let p98 = if !mags_ptr.is_null() {
        let mags = unsafe { slice::from_raw_parts_mut(mags_ptr, m_len) };
        let mut idx = 0;
        let mut i = 0;
        while i < n && idx < m_len {
            mags[idx] = abs_f32(samples[i]);
            idx += 1;
            i += step;
        }
        let used = &mut mags[..idx];
        heapsort_f32(used);
        if used.is_empty() {
            peak
        } else {
            let p_idx = ((used.len() * 98) / 100).min(used.len() - 1);
            used[p_idx]
        }
    } else {
        peak
    };
    unsafe { restore_heap(mark); }

    let tgt = if target_peak > 0.0 { target_peak } else { 0.85 };
    let mg = if max_gain > 0.0 { max_gain } else { 14.0 };
    let mut ref_peak = if p98 > 0.0 { p98 } else { peak };
    let rms_floor = rms * 2.2;
    if rms_floor > ref_peak {
        ref_peak = rms_floor;
    }
    if 0.005 > ref_peak {
        ref_peak = 0.005;
    }

    let gain = if ref_peak > 0.0 && ref_peak < tgt {
        let g = tgt / ref_peak;
        if g > mg { mg } else { g }
    } else {
        1.0
    };

    let mut final_sum_sq = 0.0_f64;
    for s in samples.iter_mut() {
        let x = *s * gain;
        let ax = abs_f32(x);
        let y = if ax <= 0.85 {
            x
        } else {
            let sign = if x < 0.0 { -1.0 } else { 1.0 };
            sign * (0.85 + 0.14 * tanh_f32((ax - 0.85) / 0.14))
        };
        *s = y;
        final_sum_sq += (y as f64) * (y as f64);
    }

    sqrt_f64(final_sum_sq / (n as f64)) as f32
}

#[no_mangle]
pub extern "C" fn wasm_detect_pitch_yin(
    ptr: i32,
    len: i32,
    sample_rate: f32,
    min_freq: f32,
    max_freq: f32,
) -> f32 {
    if ptr == 0 || len < 64 {
        return 0.0;
    }
    let n = len as usize;
    let samples = unsafe { slice::from_raw_parts(ptr as *const f32, n) };
    let sr = if sample_rate > 0.0 { sample_rate } else { 16000.0 };
    let f_min = if min_freq > 20.0 { min_freq } else { 65.0 };
    let f_max = if max_freq > f_min { max_freq } else { 500.0 };

    let mut sum_sq = 0.0_f64;
    for &s in samples.iter() {
        sum_sq += (s as f64) * (s as f64);
    }
    let rms = sqrt_f64(sum_sq / (n as f64)) as f32;
    if rms < 0.004 {
        return 0.0;
    }

    let tau_min = ((sr / f_max) as usize).max(2);
    let tau_max = (((sr / f_min) as usize) + 1).min(n / 2 - 1);
    if tau_max <= tau_min + 2 {
        return 0.0;
    }
    let w = n / 2;

    let mark = unsafe { save_heap() };
    let cmndf_ptr = wasm_alloc(((tau_max + 1) * 4) as i32) as *mut f32;
    if cmndf_ptr.is_null() {
        unsafe { restore_heap(mark); }
        return 0.0;
    }
    let cmndf = unsafe { slice::from_raw_parts_mut(cmndf_ptr, tau_max + 1) };
    cmndf[0] = 1.0;

    let mut running_sum = 0.0_f64;
    let mut best_tau: usize = 0;
    let mut best_global_tau: usize = tau_min;
    let mut best_global_val: f32 = 10.0;

    for tau in 1..=tau_max {
        let mut diff_sum = 0.0_f64;
        for j in 0..w {
            let d = (samples[j] - samples[j + tau]) as f64;
            diff_sum += d * d;
        }
        running_sum += diff_sum;
        let val = if running_sum > 0.0 {
            ((diff_sum * (tau as f64)) / running_sum) as f32
        } else {
            1.0
        };
        cmndf[tau] = val;

        if tau >= tau_min {
            if val < best_global_val {
                best_global_val = val;
                best_global_tau = tau;
            }
            if best_tau == 0 && val < 0.15 {
                best_tau = tau;
            }
        }
    }

    let chosen_tau = if best_tau != 0 {
        let mut t = best_tau;
        while t + 1 <= tau_max && cmndf[t + 1] < cmndf[t] {
            t += 1;
        }
        t
    } else if best_global_val < 0.35 {
        best_global_tau
    } else {
        unsafe { restore_heap(mark); }
        return 0.0;
    };

    let better_tau = if chosen_tau > tau_min && chosen_tau < tau_max {
        let s0 = cmndf[chosen_tau - 1];
        let s1 = cmndf[chosen_tau];
        let s2 = cmndf[chosen_tau + 1];
        let denom = 2.0 * (s0 - 2.0 * s1 + s2);
        if abs_f32(denom) > 1e-6 {
            let delta = clamp_f32((s0 - s2) / denom, -0.5, 0.5);
            (chosen_tau as f32) + delta
        } else {
            chosen_tau as f32
        }
    } else {
        chosen_tau as f32
    };

    unsafe { restore_heap(mark); }
    if better_tau > 0.0 {
        sr / better_tau
    } else {
        0.0
    }
}

#[no_mangle]
pub extern "C" fn wasm_extract_pitch_contour(
    ptr: i32,
    len: i32,
    sample_rate: f32,
    hop_samples: i32,
    window_samples: i32,
    out_contour_ptr: i32,
    max_points: i32,
    out_summary_ptr: i32,
) -> i32 {
    let sr = if sample_rate > 0.0 { sample_rate } else { 16000.0 };
    let win = if window_samples >= 64 { window_samples as usize } else { 640 };
    let hop = if hop_samples > 0 { hop_samples as usize } else { 160 };
    let n = if len > 0 { len as usize } else { 0 };
    let max_pts = if max_points > 0 { max_points as usize } else { 0 };

    if ptr == 0 || n < win {
        if out_summary_ptr != 0 {
            let sum_out = unsafe { slice::from_raw_parts_mut(out_summary_ptr as *mut f32, 8) };
            for x in sum_out.iter_mut() {
                *x = 0.0;
            }
        }
        return 0;
    }

    let raw_frames = (n - win) / hop + 1;
    let stride = if max_pts > 0 && raw_frames > max_pts {
        (raw_frames + max_pts - 1) / max_pts
    } else {
        1
    };
    let out_count = (raw_frames + stride - 1) / stride;
    let final_count = if max_pts > 0 { out_count.min(max_pts) } else { out_count };

    let mark = unsafe { save_heap() };
    let buf_ptr = if out_contour_ptr != 0 {
        out_contour_ptr as *mut f32
    } else {
        wasm_alloc((final_count * 4) as i32) as *mut f32
    };
    if buf_ptr.is_null() {
        unsafe { restore_heap(mark); }
        return 0;
    }
    let contour = unsafe { slice::from_raw_parts_mut(buf_ptr, final_count) };

    let mut voiced_count: usize = 0;
    for i in 0..final_count {
        let frame_idx = i * stride;
        let sample_off = frame_idx * hop;
        let f0 = wasm_detect_pitch_yin(ptr + (sample_off as i32) * 4, win as i32, sr, 65.0, 500.0);
        contour[i] = f0;
        if f0 > 0.0 {
            voiced_count += 1;
        }
    }

    if out_summary_ptr != 0 {
        let sum_out = unsafe { slice::from_raw_parts_mut(out_summary_ptr as *mut f32, 8) };
        if voiced_count < 2 {
            for x in sum_out.iter_mut() {
                *x = 0.0;
            }
        } else {
            let v_ptr = wasm_alloc((voiced_count * 4) as i32) as *mut f32;
            let idx_ptr = wasm_alloc((voiced_count * 4) as i32) as *mut f32;
            if v_ptr.is_null() || idx_ptr.is_null() {
                for x in sum_out.iter_mut() {
                    *x = 0.0;
                }
                unsafe { restore_heap(mark); }
                return final_count as i32;
            }
            let v_vals = unsafe { slice::from_raw_parts_mut(v_ptr, voiced_count) };
            let v_pos = unsafe { slice::from_raw_parts_mut(idx_ptr, voiced_count) };
            let mut k = 0;
            for i in 0..final_count {
                if contour[i] > 0.0 {
                    v_vals[k] = contour[i];
                    v_pos[k] = i as f32;
                    k += 1;
                }
            }

            let mut sum_hz = 0.0_f64;
            let mut min_hz = v_vals[0];
            let mut max_hz = v_vals[0];
            let mut min_idx: usize = 0;
            for i in 0..voiced_count {
                let v = v_vals[i];
                sum_hz += v as f64;
                if v < min_hz {
                    min_hz = v;
                    min_idx = i;
                }
                if v > max_hz {
                    max_hz = v;
                }
            }
            let mean_hz = (sum_hz / (voiced_count as f64)) as f32;

            let mut var_hz = 0.0_f64;
            let mut var_semi = 0.0_f64;
            let t0 = v_pos[0];
            let t1 = v_pos[voiced_count - 1];
            let t_span = if t1 > t0 { t1 - t0 } else { 1.0 };

            let mut sum_u = 0.0_f64;
            let mut sum_s = 0.0_f64;
            let mut sum_uu = 0.0_f64;
            let mut sum_us = 0.0_f64;
            for i in 0..voiced_count {
                let dh = (v_vals[i] - mean_hz) as f64;
                var_hz += dh * dh;
                let semi = (12.0 * log2_f32(v_vals[i] / mean_hz)) as f64;
                var_semi += semi * semi;
                let u = ((v_pos[i] - t0) / t_span) as f64;
                sum_u += u;
                sum_s += semi;
                sum_uu += u * u;
                sum_us += u * semi;
            }
            let std_hz = sqrt_f64(var_hz / (voiced_count as f64)) as f32;
            let std_semi = sqrt_f64(var_semi / (voiced_count as f64)) as f32;

            let n_f = voiced_count as f64;
            let denom = n_f * sum_uu - sum_u * sum_u;
            let slope_semi = if denom > 1e-6 {
                ((n_f * sum_us - sum_u * sum_s) / denom) as f32
            } else {
                0.0
            };

            let turn_point_pos = (v_pos[min_idx] - t0) / t_span;
            let edge = (voiced_count / 5).max(1);
            let mut start_hz = 0.0_f32;
            let mut end_hz = 0.0_f32;
            for i in 0..edge {
                start_hz += v_vals[i];
                end_hz += v_vals[voiced_count - 1 - i];
            }
            start_hz /= edge as f32;
            end_hz /= edge as f32;
            let low_edge = if start_hz < end_hz { start_hz } else { end_hz };
            let dip_semi = if min_hz > 0.0 && low_edge > min_hz {
                12.0 * log2_f32(low_edge / min_hz)
            } else {
                0.0
            };

            let tone_class: f32 = if dip_semi >= 1.8 && turn_point_pos >= 0.20 && turn_point_pos <= 0.85 {
                3.0
            } else if slope_semi >= 2.2 {
                2.0
            } else if slope_semi <= -2.2 {
                4.0
            } else if abs_f32(slope_semi) < 2.2 && std_semi < 1.8 {
                1.0
            } else if slope_semi > 0.0 {
                2.0
            } else {
                4.0
            };

            sum_out[0] = mean_hz;
            sum_out[1] = std_hz;
            sum_out[2] = std_semi;
            sum_out[3] = min_hz;
            sum_out[4] = max_hz;
            sum_out[5] = slope_semi;
            sum_out[6] = turn_point_pos;
            sum_out[7] = tone_class;
        }
    }

    unsafe { restore_heap(mark); }
    final_count as i32
}

// ============================================================================
// 4. SO KHỚP CHUỖI & TÌM KIẾM MỜ (UTF-16 u16)
// ============================================================================

#[no_mangle]
pub extern "C" fn wasm_levenshtein_u16(
    ptr_a: i32,
    len_a: i32,
    ptr_b: i32,
    len_b: i32,
) -> i32 {
    if len_a <= 0 {
        return len_b.max(0);
    }
    if len_b <= 0 {
        return len_a.max(0);
    }
    if ptr_a == 0 || ptr_b == 0 {
        return len_a.max(len_b);
    }

    let (a, b) = if len_a >= len_b {
        (
            unsafe { slice::from_raw_parts(ptr_a as *const u16, len_a as usize) },
            unsafe { slice::from_raw_parts(ptr_b as *const u16, len_b as usize) },
        )
    } else {
        (
            unsafe { slice::from_raw_parts(ptr_b as *const u16, len_b as usize) },
            unsafe { slice::from_raw_parts(ptr_a as *const u16, len_a as usize) },
        )
    };

    let m = a.len();
    let n = b.len();
    let mark = unsafe { save_heap() };
    let dp_ptr = wasm_alloc(((n + 1) * 4) as i32) as *mut i32;
    if dp_ptr.is_null() {
        unsafe { restore_heap(mark); }
        return m as i32;
    }
    let dp = unsafe { slice::from_raw_parts_mut(dp_ptr, n + 1) };

    for j in 0..=n {
        dp[j] = j as i32;
    }
    for i in 1..=m {
        let mut prev_diag = dp[0];
        dp[0] = i as i32;
        let ca = a[i - 1];
        for j in 1..=n {
            let old_dp_j = dp[j];
            let cost = if ca == b[j - 1] { 0 } else { 1 };
            let del = old_dp_j + 1;
            let ins = dp[j - 1] + 1;
            let sub = prev_diag + cost;
            dp[j] = del.min(ins).min(sub);
            prev_diag = old_dp_j;
        }
    }
    let ans = dp[n];
    unsafe { restore_heap(mark); }
    ans
}

#[no_mangle]
pub extern "C" fn wasm_lcs_u16(
    ptr_a: i32,
    len_a: i32,
    ptr_b: i32,
    len_b: i32,
) -> i32 {
    if len_a <= 0 || len_b <= 0 || ptr_a == 0 || ptr_b == 0 {
        return 0;
    }

    let (a, b) = if len_a >= len_b {
        (
            unsafe { slice::from_raw_parts(ptr_a as *const u16, len_a as usize) },
            unsafe { slice::from_raw_parts(ptr_b as *const u16, len_b as usize) },
        )
    } else {
        (
            unsafe { slice::from_raw_parts(ptr_b as *const u16, len_b as usize) },
            unsafe { slice::from_raw_parts(ptr_a as *const u16, len_a as usize) },
        )
    };

    let m = a.len();
    let n = b.len();
    let mark = unsafe { save_heap() };
    let dp_ptr = wasm_alloc(((n + 1) * 4) as i32) as *mut i32;
    if dp_ptr.is_null() {
        unsafe { restore_heap(mark); }
        return 0;
    }
    let dp = unsafe { slice::from_raw_parts_mut(dp_ptr, n + 1) };
    for cell in dp.iter_mut() {
        *cell = 0;
    }

    for i in 1..=m {
        let mut prev_diag = 0_i32;
        let ca = a[i - 1];
        for j in 1..=n {
            let old_dp_j = dp[j];
            if ca == b[j - 1] {
                dp[j] = prev_diag + 1;
            } else if dp[j - 1] > old_dp_j {
                dp[j] = dp[j - 1];
            }
            prev_diag = old_dp_j;
        }
    }
    let ans = dp[n];
    unsafe { restore_heap(mark); }
    ans
}

#[inline]
fn fold_ascii(c: u16) -> u16 {
    if c >= 65 && c <= 90 { c + 32 } else { c }
}

#[inline]
fn is_space_u16(c: u16) -> bool {
    c == 32 || c == 9 || c == 10 || c == 13
}

#[inline]
fn is_sep_u16(c: u16) -> bool {
    if is_space_u16(c) {
        return true;
    }
    if c < 128 {
        let is_digit = c >= 48 && c <= 57;
        let is_upper = c >= 65 && c <= 90;
        let is_lower = c >= 97 && c <= 122;
        let is_apo = c == 39;
        return !(is_digit || is_upper || is_lower || is_apo);
    }
    false
}

fn find_subslice_folded(hay: &[u16], needle: &[u16]) -> isize {
    if needle.is_empty() || needle.len() > hay.len() {
        return -1;
    }
    let limit = hay.len() - needle.len();
    let mut i = 0;
    while i <= limit {
        let mut ok = true;
        for j in 0..needle.len() {
            if fold_ascii(hay[i + j]) != fold_ascii(needle[j]) {
                ok = false;
                break;
            }
        }
        if ok {
            return i as isize;
        }
        i += 1;
    }
    -1
}

#[no_mangle]
pub extern "C" fn wasm_fuzzy_token_score(
    q_ptr: i32,
    q_len: i32,
    doc_ptr: i32,
    doc_len: i32,
) -> i32 {
    if q_ptr == 0 || doc_ptr == 0 || q_len <= 0 || doc_len <= 0 {
        return 0;
    }
    let q = unsafe { slice::from_raw_parts(q_ptr as *const u16, q_len as usize) };
    let doc = unsafe { slice::from_raw_parts(doc_ptr as *const u16, doc_len as usize) };

    let mut phrase_score: i32 = 0;
    if q.len() == doc.len() && find_subslice_folded(doc, q) == 0 {
        return 1000;
    }
    let pos = find_subslice_folded(doc, q);
    if pos == 0 {
        phrase_score = 940;
    } else if pos > 0 {
        let at_boundary = is_sep_u16(doc[(pos as usize) - 1]);
        phrase_score = if at_boundary { 880 } else { 780 };
    }

    let mut total_tokens: i32 = 0;
    let mut matched_tokens: i32 = 0;
    let mut token_score_sum: i32 = 0;

    let mut qi = 0;
    while qi < q.len() {
        while qi < q.len() && is_sep_u16(q[qi]) {
            qi += 1;
        }
        if qi >= q.len() {
            break;
        }
        let q_start = qi;
        while qi < q.len() && !is_sep_u16(q[qi]) {
            qi += 1;
        }
        let qt = &q[q_start..qi];
        total_tokens += 1;

        let mut best_tok: i32 = 0;
        let mut di = 0;
        while di < doc.len() {
            while di < doc.len() && is_sep_u16(doc[di]) {
                di += 1;
            }
            if di >= doc.len() {
                break;
            }
            let d_start = di;
            while di < doc.len() && !is_sep_u16(doc[di]) {
                di += 1;
            }
            let dt = &doc[d_start..di];
            let sub_pos = find_subslice_folded(dt, qt);
            let mut s: i32 = 0;
            if sub_pos == 0 {
                if dt.len() == qt.len() {
                    s = 1000;
                } else {
                    let pen = ((dt.len() - qt.len()) as i32 * 8).min(80);
                    s = 900 - pen;
                }
            } else if sub_pos > 0 {
                let pen = ((sub_pos as i32) * 10).min(80);
                s = 760 - pen;
            } else if qt.len() >= 3 && dt.len() >= 2 {
                let max_dist = if qt.len() <= 4 { 1 } else { 2 };
                let len_diff = (dt.len() as i32 - qt.len() as i32).abs();
                if len_diff <= max_dist {
                    let dist = wasm_levenshtein_u16(
                        (q_ptr + (q_start as i32) * 2),
                        qt.len() as i32,
                        (doc_ptr + (d_start as i32) * 2),
                        dt.len() as i32,
                    );
                    if dist <= max_dist {
                        s = (820 - dist * 160 - len_diff * 20).max(450);
                    }
                }
            }
            if s > best_tok {
                best_tok = s;
                if best_tok == 1000 {
                    break;
                }
            }
        }

        if best_tok > 0 {
            matched_tokens += 1;
            token_score_sum += best_tok;
        }
    }

    let token_score = if total_tokens > 0 && matched_tokens > 0 {
        let avg = token_score_sum / total_tokens;
        if matched_tokens == total_tokens {
            avg
        } else {
            (avg * matched_tokens * 6) / (total_tokens * 10)
        }
    } else {
        0
    };

    phrase_score.max(token_score).min(1000)
}
