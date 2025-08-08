import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import Product from '../components/Product'


const Home = () => {

    const API_URL = "https://fakestoreapi.com/products";
    const [loading,setLoading] = useState(false);
    const [posts,setPosts] = useState([]);

    async function fetchProductData(){
        setLoading(true);
        try{
            const res= await fetch(API_URL);
            const data = await res.json();
            setPosts(data);
        }catch(error){
            console.log("Error aagya hain");
            setPosts([]);
        }
        setLoading(false);
    }

    useEffect(()=>{
        fetchProductData();
    },[]);

  return (
    <div className="w-11/12 max-w-[1150px] mx-auto flex flex-wrap justify-center items-center  mt-[20px]">
        {
            loading ? <Spinner/> : 
            posts.length > 0 ?
            (<div className="grid grid-cols-4 w-full p-2 mx-auto space-y-10 space-x-5 min-h-[80vh]" >
                {
                    posts.map((post) =>(
                        <Product key={post.id} post={post}/>
                    ))
                }
            </div>) :
            <div className='flex justify-center items-center'>
                <p>No Data Found</p>
            </div>
        }
    </div>
  )
}

export default Home