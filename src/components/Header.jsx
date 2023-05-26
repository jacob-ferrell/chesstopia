import getFirstChar from "../util/getFirstChar";

export default function Header({user}) {



    return (
        <header className="fixed top-0 left-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center">
            <div></div>
            <h1>Chesstopia</h1>
            <div>{user ? getFirstChar(user.email) : ""}</div>
        </header>
    );
}