import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="flex h-screen">
            {/* Primera mitad: Formulario */}
            <div className="w-1/2 bg-white flex justify-center items-center padd">
                <div className="md:w-4/5 sm:w-full">
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">
                        Welcome back
                    </h1>
                    <small className="text-gray-400 block my-4 text-sm">
                        Welcome back! Please enter your details
                    </small>

                    <form>
                        <div className="mb-3">
                            <label className="mb-2 block text-lg font-semibold">Nombre de Usuario</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-lg font-semibold">Contraseña</label>
                            <input
                                type="password"
                                placeholder="********************"
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                            />
                        </div>

                        <div className='flex'>
                            <input type="checkbox" name="" id="" className='mr-2'/>
                            <p>Recordarme</p>
                        </div>

                        <div className="my-4 border-b-2 py-4">
                            <Link
                                to="/dashboard"
                                className="py-2 w-full block text-center bg-gray-500 text-slate-300 border rounded-xl hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    </form>

                
                    

                    <div className="mt-5 text-xs ">
                        <Link
                            to="/forgot/id"
                            className="underline text-sm text-gray-400 hover:text-gray-900"
                        >
                            Forgot your password?
                        </Link>
                    </div>

                </div>
            </div>

            {/* Segunda mitad: Imagen */}
            <div
                className="w-7/12 hidden sm:block bg-[url('/images/atlaslogin.jpg')] bg-no-repeat bg-cover bg-center"
            ></div>
        </div>
    );
};

export default Login;
