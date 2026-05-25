# Prší

This project implements a classic Czech card game "Prší" in JavaScript.
Project was originally created as a part of a graduation thesis in informatics at Gymnázium Velké Meziříčí (GVM) in 2024.

## Thesis

The game rules, theory and my approach is written in the *thesis_cs.pdf* file in greater detail, I recommend reading it, if you are interested.

## Implementation details

The game **frontend** and **logic** were implemented using **JavaScript**, specifically the **p5.js** library. All **graphic artwork** was custom-made using **MS Paint**, the retro-styled **sound effects** were synthesized via **jsfxr**, and the **soundtrack** was composed in **FL Studio**.

### Disclaimer

All the sources are cited in the thesis.

## Future works

In its current state, the game features a fully functional single-player mode, where players can play against a simple AI oponent.

Planned future updates include:
* **Multiplayer support:** Using a client-server model allows real-time matchmaking against other real players.
* **AI algorithm rework:** Currently the AI algorithm (as described in the thesis) is fairly basic and easy to beat. Upgrading the opponent's decision making would provide a more challenging game experience.
* **Score and leaderboard:** This update would allow players to track their game score and compare it with other players.

## Online playable version

The currently uploaded playable game version is available online [here](https://kroulitsch.wz.cz/prsi/).