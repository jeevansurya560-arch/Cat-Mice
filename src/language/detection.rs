use std::collections::HashMap;

/// Maps file extensions and paths to canonical programming language names.
pub struct LanguageDetector {
    extension_map: HashMap<&'static str, &'static str>,
}

impl Default for LanguageDetector {
    fn default() -> Self {
        let mut extension_map = HashMap::new();

        extension_map.insert("rs", "rust");
        extension_map.insert("py", "python");
        extension_map.insert("pyw", "python");
        extension_map.insert("js", "javascript");
        extension_map.insert("jsx", "javascript");
        extension_map.insert("mjs", "javascript");
        extension_map.insert("ts", "typescript");
        extension_map.insert("tsx", "typescript");
        extension_map.insert("go", "go");
        extension_map.insert("cpp", "cpp");
        extension_map.insert("cc", "cpp");
        extension_map.insert("cxx", "cpp");
        extension_map.insert("hpp", "cpp");
        extension_map.insert("h", "c");
        extension_map.insert("c", "c");
        extension_map.insert("cs", "csharp");
        extension_map.insert("java", "java");
        extension_map.insert("html", "html");
        extension_map.insert("htm", "html");
        extension_map.insert("css", "css");
        extension_map.insert("scss", "css");
        extension_map.insert("sh", "shell");
        extension_map.insert("bash", "shell");
        extension_map.insert("rb", "ruby");
        extension_map.insert("swift", "swift");
        extension_map.insert("kt", "kotlin");

        Self { extension_map }
    }
}

impl LanguageDetector {
    pub fn detect_from_path(&self, path: &str) -> Option<&'static str> {
        let ext = std::path::Path::new(path)
            .extension()
            .and_then(|s| s.to_str())?
            .to_lowercase();

        self.extension_map.get(ext.as_str()).copied()
    }
}
