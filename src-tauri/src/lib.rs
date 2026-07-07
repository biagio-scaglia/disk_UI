// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn fetch_steamgriddb(url: String, api_key: String) -> Result<String, String> {
    let response = ureq::get(&url)
        .set("Authorization", &format!("Bearer {}", api_key))
        .call();

    match response {
        Ok(resp) => resp.into_string().map_err(|e| e.to_string()),
        Err(ureq::Error::Status(code, resp)) => {
            let status_text = resp.into_string().unwrap_or_else(|_| "HTTP status error".to_string());
            Err(format!("STATUS_{}: {}", code, status_text))
        }
        Err(e) => Err(e.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, fetch_steamgriddb])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
