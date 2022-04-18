use photon_rs::{filters::*, monochrome::*, open_image, PhotonImage};
use wasm_bindgen::prelude::*;
use web_sys::{console::log_1 as log, CanvasRenderingContext2d, HtmlCanvasElement, ImageData};

#[wasm_bindgen]
pub fn do_something(mut image: PhotonImage) -> PhotonImage {
    log(&"Logging from Rust!".into());
    // let  image = PhotonImage::from(image_data);
    // monochrome(&mut image, 0_u32, 5_u32, 10_u32);
    obsidian(&mut image);
    // log(&JsValue::from_str(&image.get_image_data()));
    image
}
