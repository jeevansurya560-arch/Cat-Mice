use neo_pokedex::config::EvolutionConfig;
use neo_pokedex::evolution::{
    evaluate_evolution, EvolutionEngine, EvolutionMilestone, PokemonStage,
};

#[test]
fn test_stage_metadata_and_chain() {
    assert_eq!(PokemonStage::Charmander.stage_index(), 1);
    assert_eq!(PokemonStage::Charmeleon.stage_index(), 2);
    assert_eq!(PokemonStage::Charizard.stage_index(), 3);

    assert_eq!(PokemonStage::Charmander.dex_number(), "0004");
    assert_eq!(PokemonStage::Charmeleon.dex_number(), "0005");
    assert_eq!(PokemonStage::Charizard.dex_number(), "0006");

    assert_eq!(PokemonStage::Charmander.species(), "Lizard Pokémon");
    assert_eq!(PokemonStage::Charmeleon.species(), "Flame Pokémon");
    assert_eq!(PokemonStage::Charizard.species(), "Flame Pokémon");

    assert_eq!(
        PokemonStage::Charmander.next_stage(),
        Some(PokemonStage::Charmeleon)
    );
    assert_eq!(
        PokemonStage::Charmeleon.next_stage(),
        Some(PokemonStage::Charizard)
    );
    assert_eq!(PokemonStage::Charizard.next_stage(), None);

    assert_eq!(PokemonStage::Charmander.prev_stage(), None);
    assert_eq!(
        PokemonStage::Charmeleon.prev_stage(),
        Some(PokemonStage::Charmander)
    );
    assert_eq!(
        PokemonStage::Charizard.prev_stage(),
        Some(PokemonStage::Charmeleon)
    );

    assert_eq!(
        PokemonStage::Charizard.elemental_types(),
        &["Fire", "Flying"]
    );
}

#[test]
fn test_charmander_evolution_milestones() {
    // 0 commits: Grayscale baseline
    let s0 = evaluate_evolution(0);
    assert_eq!(s0.stage, PokemonStage::Charmander);
    assert_eq!(s0.progress_percent, 0);
    assert_eq!(s0.milestone, EvolutionMilestone::Baseline0);
    assert_eq!(s0.commits_to_next_evolution, Some(250));

    // 25 commits: Early spark (10%)
    let s25 = evaluate_evolution(25);
    assert_eq!(s25.stage, PokemonStage::Charmander);
    assert_eq!(s25.progress_percent, 10);
    assert_eq!(s25.milestone, EvolutionMilestone::EarlySpark10);

    // 62 commits: Accent (25%)
    let s62 = evaluate_evolution(62);
    assert_eq!(s62.stage, PokemonStage::Charmander);
    assert_eq!(s62.progress_percent, 25);
    assert_eq!(s62.milestone, EvolutionMilestone::Accent25);

    // 125 commits: Equilibrium (50%)
    let s125 = evaluate_evolution(125);
    assert_eq!(s125.stage, PokemonStage::Charmander);
    assert_eq!(s125.progress_percent, 50);
    assert_eq!(s125.milestone, EvolutionMilestone::Equilibrium50);

    // 187 commits: Advanced (75%)
    let s187 = evaluate_evolution(187);
    assert_eq!(s187.stage, PokemonStage::Charmander);
    assert_eq!(s187.progress_percent, 75);
    assert_eq!(s187.milestone, EvolutionMilestone::Advanced75);

    // 224 commits: Polish (90%)
    let s224 = evaluate_evolution(224);
    assert_eq!(s224.stage, PokemonStage::Charmander);
    assert_eq!(s224.progress_percent, 90);
    assert_eq!(s224.milestone, EvolutionMilestone::Polish90);

    // 249 commits: Mastered Charmander (100%), 1 commit until evolution
    let s249 = evaluate_evolution(249);
    assert_eq!(s249.stage, PokemonStage::Charmander);
    assert_eq!(s249.progress_percent, 100);
    assert_eq!(s249.milestone, EvolutionMilestone::Mastered100);
    assert_eq!(s249.commits_to_next_evolution, Some(1));
}

#[test]
fn test_charmeleon_evolution_milestones() {
    // 250 commits: Immediate evolution to Charmeleon, reset to 0% color
    let s250 = evaluate_evolution(250);
    assert_eq!(s250.stage, PokemonStage::Charmeleon);
    assert_eq!(s250.progress_percent, 0);
    assert_eq!(s250.milestone, EvolutionMilestone::Baseline0);
    assert_eq!(s250.commits_to_next_evolution, Some(500));

    // 500 commits: Halfway through Charmeleon (50%)
    let s500 = evaluate_evolution(500);
    assert_eq!(s500.stage, PokemonStage::Charmeleon);
    assert_eq!(s500.progress_percent, 50);
    assert_eq!(s500.milestone, EvolutionMilestone::Equilibrium50);

    // 749 commits: Max Charmeleon (100%), 1 commit until Charizard
    let s749 = evaluate_evolution(749);
    assert_eq!(s749.stage, PokemonStage::Charmeleon);
    assert_eq!(s749.progress_percent, 100);
    assert_eq!(s749.milestone, EvolutionMilestone::Mastered100);
    assert_eq!(s749.commits_to_next_evolution, Some(1));
}

#[test]
fn test_charizard_evolution_and_mastery() {
    // 750 commits: Immediate evolution to Charizard, reset to 0% color
    let s750 = evaluate_evolution(750);
    assert_eq!(s750.stage, PokemonStage::Charizard);
    assert_eq!(s750.progress_percent, 0);
    assert_eq!(s750.milestone, EvolutionMilestone::Baseline0);
    assert_eq!(s750.commits_to_next_evolution, None);
    assert_eq!(s750.commits_to_mastery, Some(1250));

    // 1250 commits: 40% Charizard
    let s1250 = evaluate_evolution(1250);
    assert_eq!(s1250.stage, PokemonStage::Charizard);
    assert_eq!(s1250.progress_percent, 40);

    // 1500 commits: 60% Charizard
    let s1500 = evaluate_evolution(1500);
    assert_eq!(s1500.stage, PokemonStage::Charizard);
    assert_eq!(s1500.progress_percent, 60);

    // 1750 commits: 80% Charizard
    let s1750 = evaluate_evolution(1750);
    assert_eq!(s1750.stage, PokemonStage::Charizard);
    assert_eq!(s1750.progress_percent, 80);
    assert_eq!(s1750.milestone, EvolutionMilestone::Advanced75);

    // 2000 commits: 100% Mastery
    let s2000 = evaluate_evolution(2000);
    assert_eq!(s2000.stage, PokemonStage::Charizard);
    assert_eq!(s2000.progress_percent, 100);
    assert_eq!(s2000.milestone, EvolutionMilestone::Mastered100);
    assert_eq!(s2000.commits_to_mastery, Some(0));

    // 2001+ and 50000 commits: Perfectly clamped at 1.0 (100%)
    let s2001 = evaluate_evolution(2001);
    assert_eq!(s2001.stage, PokemonStage::Charizard);
    assert_eq!(s2001.progress_percent, 100);
    assert_eq!(s2001.commits_to_mastery, Some(0));

    let s9999 = evaluate_evolution(9999);
    assert_eq!(s9999.stage, PokemonStage::Charizard);
    assert_eq!(s9999.progress, 1.0);
    assert_eq!(s9999.progress_percent, 100);
    assert_eq!(s9999.commits_to_mastery, Some(0));
}

#[test]
fn test_custom_evolution_engine_thresholds() {
    let custom_engine = EvolutionEngine::new(100, 300, 1000);

    let s50 = custom_engine.evaluate(50);
    assert_eq!(s50.stage, PokemonStage::Charmander);
    assert_eq!(s50.progress_percent, 50);

    let s101 = custom_engine.evaluate(101);
    assert_eq!(s101.stage, PokemonStage::Charmeleon);
    assert_eq!(s101.progress_percent, 0);

    let s301 = custom_engine.evaluate(301);
    assert_eq!(s301.stage, PokemonStage::Charizard);
    assert_eq!(s301.progress_percent, 0);

    let s1000 = custom_engine.evaluate(1000);
    assert_eq!(s1000.stage, PokemonStage::Charizard);
    assert_eq!(s1000.progress_percent, 100);

    let cfg = EvolutionConfig {
        charmander_max: 50,
        charmeleon_max: 150,
        charizard_mastery: 500,
    };
    let from_cfg = EvolutionEngine::from_config(&cfg);
    let s25 = from_cfg.evaluate(25);
    assert_eq!(s25.stage, PokemonStage::Charmander);
    assert_eq!(s25.progress_percent, 50);
}
