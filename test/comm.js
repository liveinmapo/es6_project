export function log(data) {
    console.log(data);
}

export function tmpl(strs, ...vars) {
    for (const [i, v] of vars.entries()) {
        if (v === undefined || v === "") {
            vars[i] = "X";
        }
    }

    var combined = strs.reduce((acc, v, i) => {
        return acc.concat(v, vars[i]);
    }, []);

    return combined.join("");
}
