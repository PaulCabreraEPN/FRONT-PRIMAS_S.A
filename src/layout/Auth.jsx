import {Outlet} from 'react-router-dom'

const Auth = () => {
    return (
        <div >
            <main className="justify-center content-center w-full h-screen" >
            <Outlet/>
            </main>
        </div>
        
    )
}

export default Auth