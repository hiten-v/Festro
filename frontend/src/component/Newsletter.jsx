import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter a valid email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("🎉 Subscribed successfully!");
      setEmail("");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center items-center py-20">
        <div className="flex flex-col justify-center items-center rounded-2xl m-5 p-10 w-1/2 max-md:w-full bg-gray-900 text-white">
            <div className="flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl md:text-[40px]">Stay Updated</h1>
                <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-xl">Join our newsletter and be the first to discover trending events near you.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 px-4 py-2.5 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-white/50 max-w-66 w-full" 
                    placeholder="Enter your email" 
                    required
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 group bg-black px-4 md:px-7 py-2.5 rounded-xl hover:bg-gray-600 transition-all">
                    {loading ? "Subscribing..." : "Subscribe"}
                </button>
            </form>
            {message && (
                <p className="mt-4 text-sm text-center text-gray-400">
                    {message}
                </p>
            )}
            <p className="text-gray-500 mt-6 text-xs text-center">By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
        </div>
    </section>
  );
};

export default Newsletter;
