import React from 'react'
import { MdDelete } from "react-icons/md";
import { useDispatch } from 'react-redux';
import {remove} from '../redux/Slices/CartSlice'
import { toast } from 'react-toastify';

const CartItem = ({post,itemIndex}) => {

    const dispatch = useDispatch();
    const removeFromCart =() =>{
        dispatch(remove(post.id));
        toast.error("Item removed");
    }

  return (
    <div className=''>
        <div className='flex flex-row items-center p-2 justify-between border-b-2 border-slate-500 mt-2 mb-2 gap-5'>
            <div className='w-[20%]'>
                <img src={post.image} alt='' className='object-cover mb-3'/>
            </div>
            <div className='w-[70%] flex flex-col p-0   space-y-5'>
                <div>
                 <h1 className='text-xl text-slate-700 font-semibold'>{post.title.substring(0,20)}</h1>    
                </div>
                <div>
                    <h1 className='text-base text-slate-700 font-medium'>{post.description.split(" ").slice(0,10).join(" ")+"..."}</h1>
                </div>
                <div className='flex flex-row items-center justify-between  '>
                    <div>
                        <p className='text-green-600 font-bold text-lg '>${post.price}</p>
                    </div>
                    <div onClick={removeFromCart}
                    className='bg-red-200 group hover:bg-red-400 transition-transform duration-300 cursor-pointer rounded-full p-3 mr-3'
                    >
                        <MdDelete className="text-3xl" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartItem