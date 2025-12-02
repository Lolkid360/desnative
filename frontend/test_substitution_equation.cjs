const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

console.log("Testing different cube root representations:\n");

// Test 1: Using power notation y^(1/3)
console.log("=== Test 1: y^(1/3) ===");
try {
    const expr1 = "(x^2=y^(1/3))";
    console.log("Expression:", expr1);
    const sub1 = nerdamer(expr1).sub('x', '2').toString();
    console.log("After x=2:", sub1);
    const sol1 = nerdamer.solve(sub1, 'y');
    console.log("Solution:", sol1.toString());
} catch (e) {
    console.log("Error:", e.message);
}

// Test 2: Using nthroot function
console.log("\n=== Test 2: nthroot(y, 3) ===");
try {
    const expr2 = "(x^2=nthroot(y, 3))";
    console.log("Expression:", expr2);
    const sub2 = nerdamer(expr2).sub('x', '2').toString();
    console.log("After x=2:", sub2);
    const sol2 = nerdamer.solve(sub2, 'y');
    console.log("Solution:", sol2.toString());
} catch (e) {
    console.log("Error:", e.message);
}

// Test 3: Using cbrt function
console.log("\n=== Test 3: cbrt(y) ===");
try {
    const expr3 = "(x^2=cbrt(y))";
    console.log("Expression:", expr3);
    const sub3 = nerdamer(expr3).sub('x', '2').toString();
    console.log("After x=2:", sub3);
    const sol3 = nerdamer.solve(sub3, 'y');
    console.log("Solution:", sol3.toString());
} catch (e) {
    console.log("Error:", e.message);
}

// Test 4: Direct conversion - rewrite equation before substitution
console.log("\n=== Test 4: Convert to power before solving ===");
try {
    // Internally convert sqrt[3]{y} to y^(1/3)
    const expr4 = "(x^2=y^(1/3))";
    console.log("Expression:", expr4);
    const sub4 = nerdamer(expr4).sub('x', '2');
    console.log("After x=2:", sub4.toString());
    const sol4 = nerdamer.solve(sub4.toString(), 'y');
    console.log("Solution:", sol4.toString());
    console.log("Evaluated:", nerdamer(sol4.toString()).evaluate().toString());
} catch (e) {
    console.log("Error:", e.message);
}
