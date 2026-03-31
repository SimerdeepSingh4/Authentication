import { useAuth } from "../auth/hooks/useAuth"

const Home = () => {
    const { user, handleLogout } = useAuth()
    console.log(user)

    return (
        <section className="flex min-h-screen items-center justify-center bg-[#171615] px-6 py-10">
            <div className="flex flex-col items-center gap-5">
                <h1 className="text-5xl font-semibold text-white">
                    Welcome {user?.username || "Guest"}
                </h1>
                <button onClick={handleLogout} className="rounded bg-red-500 px-6 py-2 text-white cursor-pointer">
                    Logout
                </button>
            </div>
        </section>
    )
}

export default Home
