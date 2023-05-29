export default function formatName(name) {
    if (name.at(-1) === "s") {
        return name + "'";
    }
    return name + "'s";
}