// // import ImagePreloader from "./ImagePreloader";
// import { motion } from "framer-motion";

// export default function SuccessfulEvents() {
//   return (
//     <section className="py-20 px-6 bg-[#D3DAD9]"> 
//         <h2 className="text-4xl font-bold text-center mb-12">Successful Events</h2> 
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 "> 
//             <motion.div 
//                 initial={{ opacity: 0, x: -80 }} 
//                 whileInView={{ opacity: 1, x: 0 }} 
//                 transition={{ duration: 1, ease: "easeOut" }} 
//                 className="rounded-xl flex flex-col justify-center items-center shadow-lg p-6
//                 bg-white hover:scale-105 transition ease-in duration-200" > 
//                     <img src="../landingimg/pic7.jpg" 
//                     className="rounded-lg" /> 
//                     <h3 className="text-xl font-semibold mt-4">Corporate Summit</h3> 
//                     <p className="mt-2 text-gray-600">Over 10,000 attendees.</p> 
//              </motion.div> 
//              <motion.div 
//                 initial={{ opacity: 0, y: 80 }} 
//                 whileInView={{ opacity: 1, y: 0 }} 
//                 transition={{ duration: 1, ease: "easeOut" }} 
//                 className="rounded-xl flex flex-col 
//                 justify-center items-center shadow-lg p-6 bg-white hover:scale-105 transition ease-in duration-200" > 
//                     <img src="../landingimg/pic8.jpg" className="rounded-lg" /> 
//                     <h3 className="text-xl font-semibold mt-4">Wedding Gala</h3> 
//                     <p className="mt-2 text-gray-600">Designed with elegance.</p> 
//              </motion.div> 
//              <motion.div 
//                 initial={{ opacity: 0, x: 80 }} 
//                 whileInView={{ opacity: 1, x: 0 }} 
//                 transition={{ duration: 1, ease: "easeOut" }} 
//                 className="rounded-xl flex flex-col justify-center 
//                 items-center shadow-lg p-6 bg-white hover:scale-105 transition ease-in duration-200" > 
//                     <img src="../landingimg/pic9.jpg" className="rounded-lg" /> 
//                     <h3 className="text-xl font-semibold mt-4">Music Festival</h3> 
//                     <p className="mt-2 text-gray-600">30+ artists performed.</p> 
//             </motion.div> 
//         </div>  
//     </section>
//   );
// }


import ImagePreloader from "./ImagePreloader";
import { motion } from "framer-motion";

export default function SuccessfulEvents() {
  return (
    <section className="py-20 px-6 bg-slate-900">
      <h2 className="text-4xl font-bold text-center mb-12 text-amber-50">Successful Events</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">

        {/* CARD 1 */}
        <ImagePreloader images={["../landingimg/pic7.jpg"]}>
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="rounded-xl flex flex-col justify-center items-center 
            shadow-lg p-6 bg-amber-50 hover:scale-105 transition ease-in duration-200"
          >
            <img src="../landingimg/pic7.jpg" className="rounded-lg" />
            <h3 className="text-xl font-semibold mt-4">Corporate Summit</h3>
            <p className="mt-2 text-gray-600">Over 10,000 attendees.</p>
          </motion.div>
        </ImagePreloader>

        {/* CARD 2 */}
        <ImagePreloader images={["../landingimg/pic8.jpg"]}>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="rounded-xl flex flex-col justify-center items-center 
            shadow-lg p-6 bg-amber-50 hover:scale-105 transition ease-in duration-200"
          >
            <img src="../landingimg/pic8.jpg" className="rounded-lg" />
            <h3 className="text-xl font-semibold mt-4">Wedding Gala</h3>
            <p className="mt-2 text-gray-600">Designed with elegance.</p>
          </motion.div>
        </ImagePreloader>

        {/* CARD 3 */}
        <ImagePreloader images={["../landingimg/pic9.jpg"]}>
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="rounded-xl flex flex-col justify-center items-center 
            shadow-lg p-6 bg-amber-50 hover:scale-105 transition ease-in duration-200"
          >
            <img src="../landingimg/pic9.jpg" className="rounded-lg" />
            <h3 className="text-xl font-semibold mt-4">Music Festival</h3>
            <p className="mt-2 text-gray-600">30+ global artists performed.</p>
          </motion.div>
        </ImagePreloader>

      </div>
    </section>
  );
}

