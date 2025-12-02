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

try {
    console.log("\nTesting equation x^2 = cbrt(y), x=2:");
    const x = 2;
    const y = math.pow(x * x, 3); // Since x^2 = cbrt(y), then y = (x^2)^3
    console.log(`x = ${x}`);
    console.log(`x^2 = ${math.pow(x, 2)}`);
    console.log(`y = ${y}`);
    console.log(`cbrt(y) = ${math.cbrt(y)}`);
    console.log(`Verification: x^2 = ${math.pow(x, 2)}, cbrt(y) = ${math.cbrt(y)}`);
} catch (e) {
    console.log("Error in equation test:", e.message);
}
