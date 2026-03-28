export default function formatName(name: string): string {
    if (name.at(-1) === "s") {
        return name + "'";
    }
    return name + "'s";
}
