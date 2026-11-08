use neo_pokedex::readme::{ReadmeUpdater, END_MARKER, START_MARKER};
use std::fs;
use tempfile::tempdir;

#[test]
fn test_readme_marker_synchronization_and_idempotency() {
    let temp = tempdir().expect("Failed to create tempdir");
    let readme_path = temp.path().join("README.md");

    let initial = "# My Profile\n\nWelcome to my profile!\n";
    fs::write(&readme_path, initial).expect("Initial write failed");

    // First update: should append markers and return true
    let changed1 =
        ReadmeUpdater::update_readme(&readme_path, "assets/generated/pokemon-evolution.svg")
            .expect("Update failed");
    assert!(changed1, "First update should modify file");

    let content1 = fs::read_to_string(&readme_path).expect("Read failed");
    assert!(content1.contains(START_MARKER));
    assert!(content1.contains(END_MARKER));
    assert!(content1.contains("assets/generated/pokemon-evolution.svg"));

    // Second update with same asset: should be idempotent and return false
    let changed2 =
        ReadmeUpdater::update_readme(&readme_path, "assets/generated/pokemon-evolution.svg")
            .expect("Second update failed");
    assert!(
        !changed2,
        "Second update with same content must be idempotent"
    );

    // Third update with new asset path: should replace between markers and return true
    let changed3 =
        ReadmeUpdater::update_readme(&readme_path, "assets/generated/pokemon-evolution-v2.svg")
            .expect("Third update failed");
    assert!(changed3, "Update with new asset path should modify file");

    let content3 = fs::read_to_string(&readme_path).expect("Read failed");
    assert!(content3.contains("assets/generated/pokemon-evolution-v2.svg"));
    assert!(!content3.contains("assets/generated/pokemon-evolution.svg"));
}
