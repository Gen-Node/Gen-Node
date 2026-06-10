use serde::Serialize;
use sha2::{Digest, Sha256};
use std::time::{Duration, Instant};
use sysinfo::System;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    Manager,
};

#[derive(Serialize)]
struct Specs {
    os: String,
    arch: String,
    cpu: String,
    cpus: u32,
    mem_gb: u32,
    gpu: Option<String>,
    bench: u64,
}

// Best-effort NVIDIA GPU name; None if unavailable (never panics).
fn detect_gpu() -> Option<String> {
    std::process::Command::new("nvidia-smi")
        .args(["--query-gpu=name", "--format=csv,noheader"])
        .output()
        .ok()
        .and_then(|o| {
            String::from_utf8_lossy(&o.stdout)
                .lines()
                .next()
                .map(|l| l.trim().to_string())
                .filter(|l| !l.is_empty())
        })
}

// SHA-256 hashes/sec — proves a real CPU (anti-sybil) + a capacity signal.
fn benchmark(ms: u64) -> u64 {
    let buf = [0u8; 1024];
    let end = Instant::now() + Duration::from_millis(ms);
    let mut n: u64 = 0;
    while Instant::now() < end {
        for _ in 0..200 {
            let mut h = Sha256::new();
            h.update(buf);
            let _ = h.finalize();
        }
        n += 200;
    }
    n * 1000 / ms.max(1)
}

#[tauri::command]
fn get_specs() -> Specs {
    let sys = System::new_all();
    let cpus = sys.cpus();
    let cpu = cpus
        .first()
        .map(|c| c.brand().trim().to_string())
        .filter(|s| !s.is_empty())
        .unwrap_or_else(|| "unknown".to_string());
    Specs {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        cpu,
        cpus: cpus.len() as u32,
        mem_gb: (sys.total_memory() / 1_000_000_000).max(1) as u32,
        gpu: detect_gpu(),
        bench: benchmark(500),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_specs])
        .setup(|app| {
            let show = MenuItemBuilder::with_id("show", "Show Gennode").build(app)?;
            let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
            let menu = MenuBuilder::new(app).items(&[&show, &quit]).build()?;
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .tooltip("Gennode Node")
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "quit" => app.exit(0),
                    "show" => {
                        if let Some(w) = app.get_webview_window("main") {
                            let _ = w.show();
                            let _ = w.set_focus();
                        }
                    }
                    _ => {}
                })
                .build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
