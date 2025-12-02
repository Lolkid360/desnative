const { create, all } = require('mathjs');
const math = create(all);

try {
    console.log("Testing 2sqrt(4):");
    console.log(math.evaluate('2sqrt(4)'));
} catch (e) {
    console.log("Error 2sqrt(4):", e.message);
}

try {
    console.log("Testing 2*sqrt(4):");
    console.log(math.evaluate('2*sqrt(4)'));
} catch (e) {
    console.log("Error 2*sqrt(4):", e.message);
}

try {
    console.log("Testing 2(3):");
    console.log(math.evaluate('2(3)'));
} catch (e) {
    console.log("Error 2(3):", e.message);
}
