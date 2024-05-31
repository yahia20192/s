const express = require("express");
const axios = require("axios");
const { QuickDB } = require("quick.db");
const cors = require("cors");
const store = require("store");

const client = require("./index");

const db = new QuickDB();
const app = express();

let uid;
let uname;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON middleware
app.use(express.static(__dirname + "/public"));
app.use(cors());

const refreshTokens = {};
const config = {
    link: "https://a836f504-8399-4271-9e7f-1ec1445c0f90-00-2x7ql71sydzxa.picard.replit.dev:3000/",
    client_id: "1244628732933832846",
    client_sec: "6_38fm2w8molcPmpu5Jqz7Mb8j43l9_X",
    redirect_uri:
        "https://a836f504-8399-4271-9e7f-1ec1445c0f90-00-2x7ql71sydzxa.picard.replit.dev:3000/dashboard",
};
console.log(config.client_id);
const redurl = `https://discord.com/oauth2/authorize?client_id=1244628732933832846&response_type=code&redirect_uri=https%3A%2F%2Fa836f504-8399-4271-9e7f-1ec1445c0f90-00-2x7ql71sydzxa.picard.replit.dev%3A3000%2Fdashboard&scope=identify+email`;
// Function to refresh access token using refresh token
async function refreshAccessToken(refreshToken) {
    try {
        const tokenResponse = await axios.post(
            "https://discord.com/api/oauth2/token",
            new URLSearchParams({
                client_id: config.client_id,
                client_secret: config.client_sec,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );
        console.log("bebo", tokenResponse.data);
        await store.set("reft", tokenResponse.data.refresh_token);

        return tokenResponse.data.access_token;
    } catch (error) {
        console.log(error);
    }
}

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/api/login", (req, res) => {
    res.redirect(redurl);
});

app.get("/dashboard", async (req, res) => {
    let accessToken;
    const code = req.query["code"];

    try {
        const tokenResponse = await axios
            .post(
                "https://discord.com/api/oauth2/token",
                new URLSearchParams({
                    client_id: config.client_id,
                    client_secret: config.client_sec,
                    grant_type: "authorization_code",
                    redirect_uri: config.redirect_uri,
                    code: code,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            )
            .catch((e) => console.log(e.data));

        console.log(tokenResponse.data);

        accessToken = tokenResponse.data.access_token;
        console.log("old", accessToken);
        await store.set("reft", tokenResponse.data.refresh_token);
        // Fetch user information from Discord API
        const userResponse = await axios.get(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        const username = userResponse.data.username;
        const id = userResponse.data.id;
        uid = id;
        uname = username;
        const bal = await db.get("balances." + id);
        // Render the dashboard page and pass the username to the view
        res.render("dash", {
            username,
            bal,
            err: "undefined",
            success: "non",
            link: config.link,
        });
    } catch (e) {
        console.log(e);
        let reft = await store.get("reft");
        if (reft) {
            console.log("reft", reft);
            await refreshAccessToken(reft).then(async (d) => {
                accessToken = d;
                try {
                    const userResponse = await axios.get(
                        "https://discord.com/api/users/@me",
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    );

                    const username = userResponse.data.username;
                    const id = userResponse.data.id;
                    uid = id;
                    uname = username;
                    const bal = await db.get("balances." + id);
                    // Render the dashboard page and pass the username to the view
                    res.render("dash", {
                        username,
                        bal,
                        err: "undefined",
                        success: "non",
                        link: config.link,
                    });
                } catch (e) {
                    console.log(e);
                    res.redirect(redurl);
                }
            });
        }
    }
});

app.post("/send", async (req, res) => {
    const { id, amount } = req.body;
    console.log(id, amount);
    /*    if (!id) res.redirect(redurl);
/*    
    const userVal = await axios.get(
        "https://discordlookup.mesalytic.moe/v1/user/" + id,
    );
    if (userVal.code)
        return res.json({
            username: uname,
            err: "invalid user",
            success: "non",
        });

    conso
    let userBal = await db.get("balances." + uid);
    if (!userBal) userBal = await db.set("balances." + uid, "0");
    console.log(userBal, amount);
    if (userBal < amount)
        return res.json({
            username: uname,
            err: "Insufficient balance",
            success: "non",
        });

    if (uid == id)
        return res.json({
            username: uname,
            err: "You cant send money to yourself",
            success: "non",
        });
    /*    console.log(userVal.raw);
    if (userVal.raw.bot)
        return res.render("dash", {
            err: "You cant send money to a bot.",
            success: "non",
        });

    let receiver = await db.get("balances." + id);
    if (!receiver) receiver = await db.set("balances." + id, "0");

    let reint = parseInt(receiver);
    let amint = parseInt(amount);
    let usint = parseInt(userBal);

    reint += amint;
    await db.set(`balances.${id}`, reint);

    usint -= amint;
    await db.set(`balances.${uid}`, usint);

    return res.json({
        username: uname,
        success: true,
        err: "undefined",
        bal: userBal - amint,
    });
*/
    console.log(id, "l");
    fetch(`https://canary.discord.com/api/v10/users/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot TOKEN`,
        },
    })
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
        });
});

app.get("/protected", async (req, res) => {
    const accessToken = req.query.access_token;
    if (!accessToken) {
        res.redirect(redurl);
    }

    // You can add logic here to validate the access token if needed

    // Simulate token expiration
    const expired = true;

    if (expired) {
        const refreshToken = req.query.refresh_token;
        if (!refreshToken || !refreshTokens[refreshToken]) {
            res.redirect(redurl);
        }

        try {
            const newAccessToken = await refreshAccessToken(refreshToken);
            // Send the new access token to the client
            res.send("New Access Token: " + newAccessToken);
        } catch (error) {
            res.redirect(redurl);
        }
    } else {
        // Access token is valid, continue with protected operation
        res.send("Protected Resource Accessed");
    }
});

app.listen(4000, () => console.log("started"));
