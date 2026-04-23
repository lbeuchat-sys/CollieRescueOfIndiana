/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from "motion/react";
import { 
  PawPrint, 
  Heart, 
  Stethoscope, 
  Home, 
  Truck, 
  ShoppingBag, 
  Mail, 
  MapPin, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  useEffect(() => {
    document.title = "Collie Rescue in Winchester IN | Adopt a Dog";
  }, []);

  const navLinks = [
    { name: "About Us", href: "#about" },
    { name: "Donate", href: "#donate" },
    { name: "Volunteer", href: "#volunteer" },
    { name: "Contact", href: "#contact" },
  ];

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    
    // Honeypot check for spam bots
    if (formData.get("bot-field")) {
      console.log("Bot detected");
      setFormStatus("success"); // Pretend it worked to fool the bot
      setTimeout(() => setFormStatus("idle"), 5000);
      return;
    }

    const submission = {
      access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE",
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      setErrorMessage("");
      // Send email via Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submission),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send email");
      }

      setFormStatus("success");
      // Reset after 5 seconds
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.message || "There was an error sending your message. Please try again later.");
      setFormStatus("error");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="min-h-screen flex flex-col"
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2">
              <img 
                alt="Collie Rescue of Indiana Logo" 
                className="h-12 w-auto" 
                src="/logo.png"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-sm text-gray-600">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                className="hover:text-collie-brown transition-colors" 
                href={link.href}
              >
                {link.name}
              </a>
            ))}
            <a 
              className="bg-collie-gold text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all font-semibold shadow-sm" 
              href="#adopt"
            >
              Adopt Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 py-4 px-6 flex flex-col gap-4 shadow-lg"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name}
                className="text-gray-600 font-medium py-2" 
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a 
              className="bg-collie-gold text-white px-6 py-3 rounded-full text-center font-semibold" 
              href="#adopt"
              onClick={() => setIsMenuOpen(false)}
            >
              Adopt Now
            </a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            alt="Hero Collie" 
            className="w-full h-full object-cover object-center brightness-90" 
            src="https://images.pexels.com/photos/5987625/pexels-photo-5987625.jpeg?auto=compress&cs=tinysrgb&w=2070"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 w-full text-white flex justify-end">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.3 }
              }
            }}
            className="max-w-2xl text-right"
          >
            <motion.span 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="inline-block bg-collie-gold/80 text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded mb-6 font-semibold"
            >
              501(c)(3) Nonprofit • Winchester, Indiana
            </motion.span>
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Collie Rescue in Winchester Indiana
            </motion.h1>
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="text-lg md:text-xl mb-10 text-gray-100 ml-auto max-w-xl font-light"
            >
              Welcome to Collie Rescue of Indiana, your trusted local 501(c)(3) nonprofit in Winchester, Indiana. We are dedicated to rescuing, rehabilitating, and rehoming collies in need. Adopt a dog and give every collie the forever home they deserve.
            </motion.p>
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="flex flex-wrap gap-4 justify-end"
            >
              <a className="bg-collie-gold hover:bg-opacity-90 text-white px-8 py-4 rounded-full font-semibold transition flex items-center gap-2 shadow-lg" href="#adopt">
                <PawPrint size={20} /> Adopt a Collie
              </a>
              <a className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold transition border border-white/30 flex items-center gap-2" href="#donate">
                <Heart size={20} /> Make a Donation
              </a>
            </motion.div>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="mt-20 flex gap-12 border-t border-white/20 pt-8 justify-end"
            >
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-xs uppercase tracking-wider text-gray-300">Volunteer Run</div>
              </div>
              <div>
                <div className="text-3xl font-bold">501(c)(3)</div>
                <div className="text-xs uppercase tracking-wider text-gray-300">Registered Nonprofit</div>
              </div>
              <div>
                <div className="text-3xl font-bold">∞</div>
                <div className="text-xs uppercase tracking-wider text-gray-300">Love Given</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about" className="py-24 bg-collie-tan">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <span className="text-collie-brown text-xs font-bold uppercase tracking-widest block mb-4">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Our Collie Rescue Mission in Winchester, Indiana
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>Collie Rescue of Indiana is an all-volunteer 501(c)(3) nonprofit based in Winchester, Indiana. We take in collies who are strays, pulled from shelters, or surrendered by families facing life changes, including the loss of a loved one, illness, or a move that means their dog can no longer come along.</p>
              <p>Every dog that comes through our care receives the veterinary attention, love, and stability they need before going home to a carefully matched forever family. We believe every collie deserves a safe, loving place to belong.</p>
              <p>Our network of dedicated foster families, volunteers, and supporters makes this work possible, one collie at a time.</p>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl rotate-1">
              <img 
                alt="Collie Rescue in Winchester Indiana - Our Mission" 
                className="w-full aspect-[4/3] object-cover" 
                src="/happy-collie.jpeg"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-collie-brown text-white p-6 rounded-2xl shadow-xl max-w-[200px]">
              <Heart className="mb-2 text-white fill-white" size={24} />
              <p className="text-sm font-medium leading-tight">Based in Winchester, IN</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Adoption Process Section */}
      <section id="adopt" className="py-24 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <div className="bg-collie-tan/50 p-10 rounded-[3rem] border border-collie-tan inline-block max-w-3xl">
              <span className="text-collie-brown text-xs font-bold uppercase tracking-widest block mb-4">Adoption</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Indiana Collie Adoption Process</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Our local adoption process is designed to ensure every rescued collie goes to the right home, and every family gets the right dog. Learn how to adopt a dog below.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              {[
                { 
                  step: "01", 
                  title: "Browse Available Dogs", 
                  desc: "View our available collies on Petfinder. Each listing includes personality notes, age, and care needs to help you find your match." 
                },
                { 
                  step: "02", 
                  title: "Submit an Inquiry", 
                  desc: "Reach out via our contact form or email. Tell us about your home, your family members (human and animal), and your lifestyle." 
                },
                { 
                  step: "03", 
                  title: "Describe Your Space", 
                  desc: "A fenced yard is required for the safety of our collies. Let us know the type and height of your fencing so we can make the best match." 
                },
                { 
                  step: "04", 
                  title: "Meet & Welcome Home", 
                  desc: "We'll arrange a meet-and-greet with your new companion. Once everything feels right, your collie comes home for good." 
                }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-collie-tan p-6 rounded-[2rem] border border-gray-100 flex gap-6 group hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-collie-green font-bold text-sm border border-green-100 shadow-sm">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="rounded-[2.5rem] overflow-hidden shadow-xl">
                <img 
                  alt="Adopt a Collie in Indiana" 
                  className="w-full aspect-square object-cover" 
                  src="/collie-portrait.jpeg"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] text-center">
                <h3 className="text-2xl font-bold text-collie-green mb-2">See Available Collies</h3>
                <p className="text-gray-600 mb-6 text-sm">Our adoptable dogs are listed on Petfinder with full bios and photos.</p>
                <a 
                  href="https://www.petfinder.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-collie-dark-green text-white px-8 py-3 rounded-full hover:bg-black transition-all flex items-center justify-center mx-auto gap-2 shadow-md inline-flex"
                >
                  <PawPrint size={18} /> View Dogs on Petfinder
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-24 bg-collie-dark-green text-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <span className="text-collie-gold text-xs font-bold uppercase tracking-widest block mb-4">Donate</span>
            <h2 className="text-4xl font-bold mb-4">Support Our Dog Rescue &amp; Save Lives</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">100% of donations go directly to the care of the collies in our rescue. We have no paid staff, just volunteers who show up every day out of love for this breed.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <Stethoscope size={32} />, title: "Veterinary Care", desc: "Every rescued collie receives a full health exam, vaccinations, spay/neuter, and any needed treatment before adoption." },
              { icon: <Home size={32} />, title: "Foster Care", desc: "Dogs live in loving foster homes, never kennels, where they decompress, learn, and thrive while awaiting placement." },
              { icon: <Truck size={32} />, title: "Transport", desc: "Volunteers coordinate transport to bring collies from shelters and surrender situations to the safety of our rescue." },
              { icon: <ShoppingBag size={32} />, title: "Supplies & Food", desc: "Donations keep leashes, collars, crates, food, and grooming supplies stocked for every dog in our care." }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm hover:bg-white/10 transition-colors h-full"
              >
                <div className="text-collie-gold mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto bg-white/10 border border-white/20 p-12 rounded-[2.5rem] text-center relative overflow-hidden">
            <div className="relative z-10">
              <Heart className="mx-auto mb-4 text-red-500 fill-red-500" size={40} />
              <h3 className="text-2xl font-bold mb-4">Make a Donation</h3>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Donations are accepted via PayPal. Every dollar directly funds the care, feeding, and medical needs of our rescued collies. Collie Rescue of Indiana is a registered 501(c)(3) nonprofit, and your donation may be tax deductible.
              </p>
              <a 
                href="https://www.paypal.com/ncp/payment/GH98RB4HXZ76N" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-collie-gold hover:bg-opacity-90 text-white px-10 py-4 rounded-full font-bold transition-all inline-flex items-center gap-2 shadow-lg"
              >
                🧡 Donate via PayPal
              </a>
              <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">You'll be redirected to PayPal to complete your secure donation.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Volunteer Section */}
      <section id="volunteer" className="py-24 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <div className="bg-collie-tan/50 p-10 rounded-[3rem] border border-collie-tan inline-block max-w-3xl">
              <span className="text-collie-brown text-xs font-bold uppercase tracking-widest block mb-4">Get Involved</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Volunteer at Our Local Animal Rescue</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">We have no paid staff. Every collie rescued, every adoption arranged, every vet visit scheduled, it's all done by people like you who simply care.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: "🏡", title: "Foster a Collie", desc: "Open your home to a dog in transition. Foster families provide the safety net every rescue depends on." },
                { icon: "🚗", title: "Transport Volunteer", desc: "Help move collies from shelters or surrender situations to foster homes and adoption events across Indiana." },
                { icon: "📋", title: "Home Visits", desc: "Visit prospective adopter homes to ensure they're the right fit for one of our dogs." },
                { icon: "📣", title: "Outreach & Events", desc: "Help staff adoption events, manage social media, or spread the word about our available dogs." },
                { icon: "💻", title: "Administrative Help", desc: "Website, photography, grant writing, intake coordination, there's always more to do behind the scenes." },
                { icon: "🛒", title: "Supply Drives", desc: "Organize or donate food, bedding, crates, and grooming supplies for dogs in our care." }
              ].map((role, idx) => (
                <div 
                  key={idx}
                  className="bg-collie-tan p-6 rounded-[2rem] border border-gray-100 hover:shadow-sm transition-all h-full"
                >
                  <div className="text-2xl mb-3">{role.icon}</div>
                  <h4 className="font-bold text-gray-800 mb-2">{role.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </div>
          <div className="space-y-8">
            <div className="rounded-[2.5rem] overflow-hidden shadow-xl">
              <img 
                alt="Woman with Collie volunteering in Indiana" 
                className="w-full h-80 object-cover object-center" 
                src="/woman-collie.jpeg"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <div className="bg-collie-tan border border-gray-100 p-8 rounded-[2.5rem]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Help?</h3>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">Whether you can open your home, drive a dog to the vet, or help from behind a keyboard, we'd love to have you on the team. Reach out and we'll find the right fit for your skills and schedule.</p>
              <div className="flex flex-col gap-4">
                <a 
                  href="#contact"
                  className="bg-collie-green text-white px-8 py-3 rounded-full hover:bg-collie-dark-green transition-all flex items-center justify-center gap-2 shadow-sm font-semibold"
                >
                  🙋 Get In Touch
                </a>
                <a className="bg-collie-gold text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 font-bold shadow-sm" href="https://www.paypal.com/ncp/payment/GH98RB4HXZ76N" target="_blank" rel="noopener noreferrer">
                  🧡 Donate via PayPal
                </a>
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-collie-tan">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-16 items-center"
        >
          <div className="lg:col-span-2">
            <span className="text-collie-brown text-xs font-bold uppercase tracking-widest block mb-4">Contact Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">We'd Love to Hear From You</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-collie-brown">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Email Us</h4>
                  <a href="mailto:Collierescue1@aol.com" className="text-gray-600 hover:text-collie-brown transition-colors">Collierescue1@aol.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-collie-brown">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Location</h4>
                  <p className="text-gray-600">Winchester, Indiana</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              {formStatus === "success" ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. A volunteer will get back to you as soon as possible.</p>
                </div>
              ) : formStatus === "error" ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Submission Failed</h3>
                  <p className="text-gray-600">{errorMessage}</p>
                  <button 
                    onClick={() => setFormStatus("idle")}
                    className="mt-6 text-collie-green font-semibold hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  {/* Honeypot field - hidden from real users, but bots will fill it out */}
                  <input type="text" name="bot-field" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Name *</label>
                      <input 
                        name="name"
                        className="w-full border-gray-200 rounded-lg focus:ring-collie-green focus:border-collie-green py-3 px-4 outline-none transition-all border bg-gray-50/50" 
                        placeholder="Your Name Here" 
                        type="text" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email *</label>
                      <input 
                        name="email"
                        className="w-full border-gray-200 rounded-lg focus:ring-collie-green focus:border-collie-green py-3 px-4 outline-none transition-all border bg-gray-50/50" 
                        placeholder="you@example.com" 
                        type="email" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">I'm reaching out about...</label>
                    <select 
                      name="subject"
                      className="w-full border-gray-200 rounded-lg focus:ring-collie-green focus:border-collie-green py-3 px-4 text-gray-500 outline-none transition-all bg-gray-50/50 border"
                    >
                      <option>Adoption Inquiry</option>
                      <option>Volunteering</option>
                      <option>Fostering</option>
                      <option>Donation / Supplies</option>
                      <option>Owner Surrender</option>
                      <option>General Question</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                    <textarea 
                      name="message"
                      className="w-full border-gray-200 rounded-lg focus:ring-collie-green focus:border-collie-green py-3 px-4 outline-none transition-all border bg-gray-50/50" 
                      placeholder="How can we help?" 
                      rows={4}
                      required
                    ></textarea>
                  </div>
                  <button 
                    disabled={formStatus === "submitting"}
                    className="w-full bg-[#2d5a3c] hover:bg-[#244830] text-white font-bold py-4 rounded-full transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    type="submit"
                  >
                    {formStatus === "submitting" ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-collie-deep-brown text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <img 
                alt="Collie Rescue Footer Logo" 
                className="h-16 w-auto mb-8" 
                src="/logo.png"
                referrerPolicy="no-referrer"
              />
              <p className="text-gray-300 max-w-sm text-sm leading-relaxed">
                Rescuing, rehabilitating, and rehoming collies in need across Indiana, powered entirely by volunteers.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-300">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a className="hover:text-collie-gold transition-colors" href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Find Our Dogs</h4>
              <a 
                className="text-sm text-gray-300 hover:text-collie-gold transition-colors flex items-center gap-2 mb-8" 
                href="https://www.petfinder.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PawPrint size={14} /> Available Dogs on Petfinder <ChevronRight size={14} />
              </a>
              <h4 className="font-bold text-lg mb-6">Contact &amp; Location</h4>
              <address className="not-italic text-sm text-gray-300 space-y-2">
                <p className="font-bold text-white">Collie Rescue of Indiana</p>
                <p>Winchester, Indiana</p>
                <p className="mt-4"><a href="mailto:Collierescue1@aol.com" className="hover:text-collie-gold transition-colors block">Collierescue1@aol.com</a></p>
              </address>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest gap-4">
            <div className="text-center md:text-left">© 2026 Collie Rescue of Indiana. All rights reserved. 501(c)(3) Nonprofit.</div>
            <div className="text-center md:text-right flex flex-col gap-2">
              <div>Made with ❤️ by volunteers, for collies.</div>
              <div>
                Website designed and built by <a href="https://www.korva.digital/" target="_blank" rel="noopener noreferrer" className="text-collie-gold hover:underline font-bold">Korva Digital</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Donate Button */}
      <motion.a
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        href="https://www.paypal.com/ncp/payment/GH98RB4HXZ76N"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-collie-gold text-white px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-2 hover:bg-opacity-90 hover:scale-105 transition-all"
      >
        <Heart size={20} className="fill-white" />
        Donate
      </motion.a>
    </motion.div>
  );
}
