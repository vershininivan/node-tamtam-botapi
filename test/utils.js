exports = module.exports = {
    /**
     * Random integer from min to max
     */
    randomInteger,
};

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}
