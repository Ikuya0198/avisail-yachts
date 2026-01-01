import Image from "next/image";

// Sample yacht data - will be replaced with real scraped data
const sampleYachts = [
  {
    id: 1,
    name: "Azure Dream",
    type: "Motor Yacht",
    length: "24m",
    year: 2019,
    price: "$1,200,000",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80",
  },
  {
    id: 2,
    name: "Pacific Star",
    type: "Sailing Yacht",
    length: "18m",
    year: 2021,
    price: "$850,000",
    image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80",
  },
  {
    id: 3,
    name: "Horizon Elite",
    type: "Motor Yacht",
    length: "32m",
    year: 2020,
    price: "$2,400,000",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80",
  },
  {
    id: 4,
    name: "Ocean Whisper",
    type: "Catamaran",
    length: "15m",
    year: 2022,
    price: "$680,000",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80",
  },
];

const services = [
  {
    title: "Private Viewings",
    description: "Exclusive appointments at your convenience. Visit yachts in Tokyo Bay or any Japanese marina.",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  },
  {
    title: "Sea Trials",
    description: "Experience the vessel firsthand. We arrange comprehensive sea trials with professional crew.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Survey & Inspection",
    description: "Independent marine surveys by certified professionals. Complete transparency on vessel condition.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Global Delivery",
    description: "Professional yacht transport worldwide. Licensed captains and full insurance coverage.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
  },
];

export default function Home() {
  return (
    <div className="bg-navy min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1920&q=80"
            alt="Luxury superyacht cruising"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-6">
            Japanese Luxury Yachts
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
            Discover
            <span className="block text-gold-gradient">Exceptional Vessels</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Curated selection of premium Japanese yachts for discerning buyers worldwide.
            Experience maritime excellence with uncompromising quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#collection" className="btn-luxury">
              View Collection
            </a>
            <a
              href="#contact"
              className="border border-gold text-gold px-8 py-3 uppercase tracking-widest text-sm hover:bg-gold hover:text-navy transition-all"
            >
              Private Inquiry
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Our Fleet</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white">
              Featured Collection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sampleYachts.map((yacht) => (
              <div
                key={yacht.id}
                className="group relative bg-navy-light overflow-hidden border border-gold/20 hover:border-gold/50 transition-all duration-500"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={yacht.image}
                    alt={yacht.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-gold text-sm uppercase tracking-wider mb-1">{yacht.type}</p>
                      <h3 className="font-serif text-2xl text-white mb-2">{yacht.name}</h3>
                      <div className="flex gap-4 text-white/60 text-sm">
                        <span>{yacht.length}</span>
                        <span>&bull;</span>
                        <span>{yacht.year}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-serif text-2xl">{yacht.price}</p>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="btn-luxury transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    View Details
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/60 mb-4">More yachts coming soon...</p>
            <a href="#contact" className="text-gold hover:text-gold-light transition-colors">
              Request our full catalogue &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-navy-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">White Glove Service</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white">
              Premium Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 border border-gold/20 hover:border-gold/50 transition-all group"
              >
                <div className="w-12 h-12 border border-gold flex items-center justify-center mb-6 group-hover:bg-gold transition-all">
                  <svg
                    className="w-6 h-6 text-gold group-hover:text-navy transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-white mb-3">{service.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Get in Touch</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Private Inquiry
          </h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            Our yacht specialists are available to assist you with finding your perfect vessel.
            All inquiries are handled with complete discretion.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="mailto:yachts@avisail.com"
              className="btn-luxury flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
            <a
              href="https://wa.me/817093101362"
              target="_blank"
              className="border border-gold text-gold px-8 py-3 uppercase tracking-widest text-sm hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
