import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index", {
        pokemon: null,
        error: null
    });
});

app.post("/search", async (req, res) => {
    const pokemonName = req.body.pokemon.trim().toLowerCase();

    if (!pokemonName) {
        return res.render("index", {
            pokemon: null,
            error: "Please enter a Pokémon name."
        });
    }

    try {
        const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonName)}`
        );

        const data = response.data;

        // store total stats of the pokemon
        const totalStats = data.stats.reduce(
            (total, stat) => total + stat.base_stat,
            0
        );

        const statBarWidth = Math.min((totalStats / 700) * 100, 100);
        
        const pokemon = {
            id: data.id,
            name: data.name,

            image:
                data.sprites.other["official-artwork"].front_default ||
                data.sprites.front_default,

            types: data.types.map(type => type.type.name),

            height: data.height / 10,
            weight: data.weight / 10,

            abilities: data.abilities.map(
                ability => ability.ability.name
            ),

            stats: data.stats.map(stat => ({
                name: stat.stat.name,
                value: stat.base_stat
            })),

            totalStats: totalStats,
            statBarWidth: statBarWidth
        };

        res.render("index", {
            pokemon: pokemon,
            error: null
        });

    } catch (error) {
        console.error(error.message);

        if (error.response && error.response.status === 404) {
            res.render("index", {
                pokemon: null,
                error: "Pokémon not found. Check the spelling and try again."
            });
        } else {
            res.render("index", {
                pokemon: null,
                error: "Something went wrong while contacting PokéAPI."
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

