import React from "react";

const Ecard = () => {
  
 const images = [
  { 
    imge: "/pexels-olly-927022.jpg", 
    states: "ACTIVE", 
    name: "Olivia Williams", 
    role: "PHP Web Developer",
    email: "o.williams@example.com" 
  },
  { 
    imge: "/pexels-olly-927022.jpg", 
    states: "ACTIVE", 
    name: "Liam Johnson", 
    role: "React Developer",
    email: "l.johnson@example.com" 
  },
  { 
    imge: "/pexels-olly-927022.jpg", 
    states: "ON-LEAVE", 
    name: "Emma Brown", 
    role: "UI/UX Designer",
    email: "e.brown@example.com" 
  },
  { 
    imge: "/pexels-olly-927022.jpg", 
    states: "DEACTIVE", 
    name: "Noah Smith", 
    role: "Backend Developer",
    email: "n.smith@example.com" 
  },
  { 
    imge: "/pexels-olly-927022.jpg", 
    states: "ACTIVE", 
    name: "Ava Davis", 
    role: "Full Stack Developer",
    email: "a.davis@example.com" 
  },
  { 
    imge: "/pexels-olly-927022.jpg", 
    states: "ACTIVE", 
    name: "William Miller", 
    role: "DevOps Engineer",
    email: "w.miller@example.com" 
  },
];


  return (
 
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-center gap-11 sm:p-6 p-1 ">
   {images.map((img,index) => (
      <div key={index} className=" rounded-2xl shadow-md border-gray-200 p-3 space-y-4 ">
      <div className="flex flex-row justify-between px-2">
        <input
          type="radio"
          name={img.role}
          className="w-4 h-4 accent-blue-500 my-auto"
          defaultChecked={img.states === "ACTIVE"}
        />

        <div className="flex gap-5">
          <p className={`my-auto rounded-2xl p-0.5 px-2 font-semibold text-[11px] 
            ${img.states === "ACTIVE" ? "bg-green-200 text-green-700" 
                : img.states === "DEACTIVE" ? "bg-red-200 text-red-700"
                : "bg-blue-200 text-blue-700"}`}>{img.states}</p>
          <p className="font-bold">⋮</p>
        </div>
      </div>
      <div className="flex gap-5 px-1.5">
        <img src={img.imge} alt="" className="w-12 rounded-full" />
        <div>
          <p className="font-bold">{img.name}</p>
          <p className="text-gray-600">{img.role}</p>
        </div>
      </div>
      <div className="flex justify-between px-1.5">
        <div>
          <p className="text-gray-400 text-[13px] font-semibold">DEPARTMENT</p>
          <p className="text-gray-800">Developement</p>
        </div>
        <div>
          <p className="text-gray-400 text-[13px] font-semibold">DATE OF JOINING</p>
          <p className="text-gray-700">Nov 24, 2025</p>
        </div>
      </div>
      <div className="flex flex-col rounded-2xl bg-gray-200 p-2 gap-0.5 text-gray-700">
        <a href="">{img.email}</a>
          <hr className="border-gray-300" />
        <a href="">(123)456-7890</a>
      </div>
      <div className="flex  max-w-full gap-3">
        <button className="flex-1 bg-[#90DAFF] rounded-3xl py-1.5">Edit</button>
        <button className="flex-1 bg-blue-400   rounded-3xl py-1">View</button>
      </div>
    </div>
   ))}
   </div>

  );
};

export default Ecard;