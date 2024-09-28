import { useShallow } from 'zustand/react/shallow'
import { useStore } from "../../store"
import { Posts } from '../Posts/'
import './Home.css'

export function Home() {
    const { searchSelectedItem } = useStore(
        useShallow((state) => ({
            searchSelectedItem: state.searchSelectedItem,
        }))
    );

    return (
        <div className='home'>
            {searchSelectedItem ? <Posts /> : "Home page"}
        </div>
    )
}
