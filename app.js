const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const moment = require('moment-timezone');

const app = express();
app.use(bodyParser.json());

const receipts = {};

app.post('/receipts/process', (req, res) => {
    const receipt = req.body;

    // Validate the receipt data
    if (!isValidReceipt(receipt)) {
        res.status(400).json({ error: 'Invalid receipt data' });
        return;
    }

    // Calculate points based on receipt rules (implement this logic)
    const points = calculatePoints(receipt);

    // Generate a unique ID for the receipt
    const receiptID = uuid.v4();

    receipts[receiptID] = receipt;

    res.status(201).json({ id: receiptID });
});

app.get('/receipts/:id/points', (req, res) => {
    const receiptID = req.params.id;
    const receipt = receipts[receiptID];

    if (!receipt) {
        res.status(404).json({ error: 'Receipt not found' });
        return;
    }

    // Calculate points for the receipt
    const points = calculatePoints(receipt);

    res.status(200).json({ points });
});

function calculatePoints(receipt) {
    // Implement the points calculation logic as per the API specification.
    // Return the calculated points.
    let points = 0;

    // Rule 1: One point for every alphanumeric character in the retailer name
    points += receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length;
    

    // Rule 2: 50 points if the total is a round dollar amount with no cents
    if (Number(receipt.total) === Math.floor(Number(receipt.total))) {
        points += 50;
    }
    
    // Rule 3: 25 points if the total is a multiple of 0.25
    if (Number(receipt.total) % 0.25 === 0) {
        points += 25;
    }
    
    // Rule 4: 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;
  
    // Rule 5: If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
    receipt.items.forEach((item) => {
        const descriptionLength = item.shortDescription.trim().length;
        if (descriptionLength % 3 === 0) {
            points += Math.ceil(Number(item.price) * 0.2);
        }
    });
    
    // Rule 6: 6 points if the day in the purchase date is odd
    const purchaseDate = moment.tz(receipt.purchaseDate, 'GMT');
    // Adjust 'GMT' to the specific time zone mentioned in your date string.

    if (purchaseDate.date() % 2 === 1) {
        points += 6;
    }

    // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const purchaseTime = receipt.purchaseTime.split(':');
    const hours = parseInt(purchaseTime[0], 10);
    const minutes = parseInt(purchaseTime[1], 10);
    if (hours === 14 && minutes === 0) {
    points += 0;
} else if (hours >= 14 && hours<16) {
    points += 10;
}
    
    return points;
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
function isValidReceipt(receipt) {
    // To check if retailer is a non-empty string
    if (!receipt.retailer || typeof receipt.retailer !== 'string' || receipt.retailer.trim() === '') {
        return false;
    }

    // To check if purchaseDate is a valid date in the format 'YYYY-MM-DD'
    if (!receipt.purchaseDate || !moment(receipt.purchaseDate, 'YYYY-MM-DD', true).isValid()) {
        return false;
    }

    // To check if purchaseTime is a valid time in the 24-hour format 'HH:mm'
    if (!receipt.purchaseTime || !moment(receipt.purchaseTime, 'HH:mm', true).isValid()) {
        return false;
    }

    // To check if items is an array with at least one item
    if (!receipt.items || !Array.isArray(receipt.items) || receipt.items.length === 0) {
        return false;
    }

    // To check each item in the items array
    for (const item of receipt.items) {
        if (!item.shortDescription || typeof item.shortDescription !== 'string' || item.shortDescription.trim() === '') {
            return false;
        }
        
        // to check if price is a valid decimal number in the format 'X.YY'
        if (!item.price || isNaN(Number(item.price)) || Number(item.price) <= 0) {
            return false;
        }
    }

    // to check if total is a valid decimal number in the format 'X.YY'
    if (!receipt.total || isNaN(Number(receipt.total)) || Number(receipt.total) <= 0) {
        return false;
    }

    return true;
}