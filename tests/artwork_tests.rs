use neo_pokedex::artwork::{ArtworkGenerator, ArtworkLoader, ArtworkValidator, RegionMaskId};
use neo_pokedex::evolution::PokemonStage;
use tempfile::tempdir;

#[test]
fn test_artwork_charmander_geometry_and_masks() {
    let pkg = ArtworkGenerator::generate(PokemonStage::Charmander);
    let report = ArtworkValidator::validate(&pkg).expect("Charmander package must be valid");

    assert_eq!(pkg.width, 160);
    assert_eq!(pkg.height, 160);
    assert_eq!(report.overlap_count, 0, "No mask overlaps permitted");
    assert_eq!(
        report.unmasked_count, 0,
        "No unmasked opaque pixels permitted"
    );
    assert!(report.is_valid);

    // Verify required masks
    let required = [
        RegionMaskId::Body,
        RegionMaskId::Belly,
        RegionMaskId::FaceEyes,
        RegionMaskId::LimbsClaws,
        RegionMaskId::Tail,
        RegionMaskId::Flame,
    ];
    for req in &required {
        assert!(pkg.masks.contains_key(req), "Missing mask: {:?}", req);
        assert!(
            pkg.masks[req].pixel_count > 0,
            "Mask must not be empty: {:?}",
            req
        );
    }

    // Verify flame priority is highest
    for y in 0..160 {
        for x in 0..160 {
            if pkg.masks[&RegionMaskId::Flame].mask.get_pixel(x, y)[0] > 127 {
                let q = pkg.priority_map.get_priority(x, y);
                assert!(
                    q >= 0.849,
                    "Flame pixel ({}, {}) priority must be >= 0.85, got {}",
                    x,
                    y,
                    q
                );
            }
        }
    }
}

#[test]
fn test_artwork_charmeleon_geometry_and_masks() {
    let pkg = ArtworkGenerator::generate(PokemonStage::Charmeleon);
    let report = ArtworkValidator::validate(&pkg).expect("Charmeleon package must be valid");

    assert_eq!(pkg.width, 160);
    assert_eq!(pkg.height, 160);
    assert_eq!(report.overlap_count, 0, "No mask overlaps permitted");
    assert_eq!(
        report.unmasked_count, 0,
        "No unmasked opaque pixels permitted"
    );
    assert!(report.is_valid);

    // Verify required masks including cranial crest and razor claws
    let required = [
        RegionMaskId::Body,
        RegionMaskId::Belly,
        RegionMaskId::CranialCrest,
        RegionMaskId::ArmsClaws,
        RegionMaskId::LegsClaws,
        RegionMaskId::Tail,
        RegionMaskId::Flame,
    ];
    for req in &required {
        assert!(pkg.masks.contains_key(req), "Missing mask: {:?}", req);
        assert!(
            pkg.masks[req].pixel_count > 0,
            "Mask must not be empty: {:?}",
            req
        );
    }
}

#[test]
fn test_artwork_charizard_geometry_and_masks() {
    let pkg = ArtworkGenerator::generate(PokemonStage::Charizard);
    let report = ArtworkValidator::validate(&pkg).expect("Charizard package must be valid");

    assert_eq!(pkg.width, 160);
    assert_eq!(pkg.height, 160);
    assert_eq!(report.overlap_count, 0, "No mask overlaps permitted");
    assert_eq!(
        report.unmasked_count, 0,
        "No unmasked opaque pixels permitted"
    );
    assert!(report.is_valid);

    // Verify required masks including horns and outer/inner wings
    let required = [
        RegionMaskId::Body,
        RegionMaskId::Belly,
        RegionMaskId::HeadHorns,
        RegionMaskId::WingsOuter,
        RegionMaskId::WingsInner,
        RegionMaskId::LimbsClaws,
        RegionMaskId::Tail,
        RegionMaskId::Flame,
    ];
    for req in &required {
        assert!(pkg.masks.contains_key(req), "Missing mask: {:?}", req);
        assert!(
            pkg.masks[req].pixel_count > 0,
            "Mask must not be empty: {:?}",
            req
        );
    }
}

#[test]
fn test_artwork_loader_disk_roundtrip() {
    let temp = tempdir().expect("Failed to create tempdir");
    let base_path = temp.path();

    let stages = [
        PokemonStage::Charmander,
        PokemonStage::Charmeleon,
        PokemonStage::Charizard,
    ];

    for stage in stages {
        let loaded = ArtworkLoader::load(stage, base_path)
            .unwrap_or_else(|e| panic!("Failed to load/generate {:?}: {:?}", stage, e));

        assert_eq!(loaded.width, 160);
        assert_eq!(loaded.height, 160);

        // Verify files actually exist on disk
        let stage_dir = base_path.join("pokemon").join(stage.folder_name());
        assert!(stage_dir.join("master_grayscale.png").exists());
        assert!(stage_dir.join("priority_map.png").exists());
        assert!(stage_dir.join("masks").exists());

        // Reload to verify filesystem persistence
        let reloaded =
            ArtworkLoader::load(stage, base_path).expect("Reload from disk must succeed");
        assert_eq!(reloaded.width, 160);
        assert_eq!(reloaded.height, 160);
        assert_eq!(loaded.masks.len(), reloaded.masks.len());
    }
}

#[test]
fn test_mask_overlap_detection_failure() {
    let mut pkg = ArtworkGenerator::generate(PokemonStage::Charmander);

    // Find an existing body pixel coordinate
    let mut overlap_coord = None;
    if let Some(body_mask) = pkg.masks.get(&RegionMaskId::Body) {
        for y in 0..160 {
            for x in 0..160 {
                if body_mask.mask.get_pixel(x, y)[0] > 127 {
                    overlap_coord = Some((x, y));
                    break;
                }
            }
            if overlap_coord.is_some() {
                break;
            }
        }
    }

    // Force an overlap by also marking that pixel in the belly mask
    if let Some((x, y)) = overlap_coord {
        if let Some(belly_mask) = pkg.masks.get_mut(&RegionMaskId::Belly) {
            belly_mask.mask.put_pixel(x, y, image::Luma([255]));
            belly_mask.pixel_count += 1;
        }
    }

    let result = ArtworkValidator::validate(&pkg);
    assert!(
        result.is_err(),
        "Validator must catch introduced mask overlap"
    );
}
