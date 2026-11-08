use neo_pokedex::config::AppConfig;
use neo_pokedex::evolution::{evaluate_evolution, PokemonStage};

#[test]
fn test_default_config_resolution() {
    let config = AppConfig::default();
    assert_eq!(config.user.username, "developer");
    assert_eq!(config.evolution.charmander_max, 249);
    assert_eq!(config.evolution.charmeleon_max, 749);
    assert_eq!(config.evolution.charizard_mastery, 2000);
    assert_eq!(config.output.width, 480);
    assert_eq!(config.output.height, 480);
    assert_eq!(config.output.fps, 10);
}

#[test]
fn test_evolution_threshold_charmander() {
    let s0 = evaluate_evolution(0);
    assert_eq!(s0.stage, PokemonStage::Charmander);
    assert_eq!(s0.progress_percent, 0);

    let s125 = evaluate_evolution(125);
    assert_eq!(s125.stage, PokemonStage::Charmander);
    assert_eq!(s125.progress_percent, 50);

    let s249 = evaluate_evolution(249);
    assert_eq!(s249.stage, PokemonStage::Charmander);
    assert_eq!(s249.progress_percent, 100);
}

#[test]
fn test_evolution_threshold_charmeleon() {
    let s250 = evaluate_evolution(250);
    assert_eq!(s250.stage, PokemonStage::Charmeleon);
    assert_eq!(s250.progress_percent, 0);

    let s500 = evaluate_evolution(500);
    assert_eq!(s500.stage, PokemonStage::Charmeleon);
    assert_eq!(s500.progress_percent, 50);

    let s749 = evaluate_evolution(749);
    assert_eq!(s749.stage, PokemonStage::Charmeleon);
    assert_eq!(s749.progress_percent, 100);
}

#[test]
fn test_evolution_threshold_charizard() {
    let s750 = evaluate_evolution(750);
    assert_eq!(s750.stage, PokemonStage::Charizard);
    assert_eq!(s750.progress_percent, 0);

    let s1250 = evaluate_evolution(1250);
    assert_eq!(s1250.stage, PokemonStage::Charizard);
    assert_eq!(s1250.progress_percent, 40);

    let s1500 = evaluate_evolution(1500);
    assert_eq!(s1500.stage, PokemonStage::Charizard);
    assert_eq!(s1500.progress_percent, 60);

    let s2000 = evaluate_evolution(2000);
    assert_eq!(s2000.stage, PokemonStage::Charizard);
    assert_eq!(s2000.progress_percent, 100);

    // Over-mastery clamping
    let s5000 = evaluate_evolution(5000);
    assert_eq!(s5000.stage, PokemonStage::Charizard);
    assert_eq!(s5000.progress_percent, 100);
}

