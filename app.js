const express = require("express");
const rates = require("./rates");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Currency Converter API (Static Rates)");
});

/**
 * GET /convert?from=USD&to=INR&amount=100
 */
app.get("/convert", (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).json({
            error: "Please provide from, to, and amount"
        });
    }

    if (!rates[from] || !rates[to]) {
        return res.status(400).json({
            error: "Unsupported currency"
        });
    }

    const amt = Number(amount);
    if (amt <= 0) {
        return res.status(400).json({
            error: "Amount must be greater than zero"
        });
    }

    const converted =
        (amt / rates[from]) * rates[to];

    res.json({
        from,
        to,
        amount: amt,
        convertedAmount: converted.toFixed(2),
        rateUsed: rates[to] / rates[from]
    });
});

app.listen(3000, () => {
    console.log("Currency Converter running on port 3000");
});