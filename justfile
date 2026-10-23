[private]
[doc('Display the list of recipes')]
default:
  @just --list

mod? setup-project '.github/scripts/setup-project/setup-project.just'
mod? sdd '.github/scripts/int-subagent-driven-dev/sdd.just'
