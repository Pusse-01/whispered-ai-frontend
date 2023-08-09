import React from 'react'
import { getUserDataFromLocalStorage } from '../utils'

function Home() {
    const user = getUserDataFromLocalStorage();

    return (
        <div className="text-3xl font-bold underline">
            Hello {user.name}
        </div>
    )
}

export default Home
