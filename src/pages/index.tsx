import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "../utils/api";

const Home: NextPage = () => {
    const blocks = api.blocks.getAll.useQuery();

    if (!blocks.data) {

        if (blocks.error) {
            console.log(blocks.error)
            return <div>error...</div>
        }
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-col items-center bg-slate-900">
            {blocks.data.map(d => {
                    return (<div key={d.id} className="bg-slate-200 p-8 rounded mb-2">
                       <img src={d.imageURL}/> 
                       <div>{d.name}</div> 
                    </div>)
                }
            )}
        </div>
    );
};

export default Home;
