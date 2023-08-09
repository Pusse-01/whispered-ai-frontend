import React from 'react'
import BotsHeader from '../components/bots_header'
import BotsTable from '../components/bots_tables'

function Bots() {
    return (
        <div className=" px-4 md:px-8 py-4 ml-20">
            <BotsHeader />
            <BotsTable />
        </div>
    )
}

export default Bots
