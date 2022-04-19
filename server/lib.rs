pub use photon_rs::{filters::*, open_image, to_image_data, PhotonImage};
use wasm_bindgen::prelude::*;
use web_sys::console::log_1 as log;

#[wasm_bindgen]
pub fn console_log(message: String) {
    log(&message.into());
}
