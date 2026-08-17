import { useState } from "react";
import { Play } from "lucide-react";

export const QuoteSection = () => {
  const [drFahadImg, setDrFahadImg] = useState<string>(
    "/assets/images/Dr Fahad Saeed.jpeg",
  );

  return (
    <section className="py-16 bg-slate-50 border-t border-gray-200">
      <div className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white text-gray-900 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden border border-gray-200">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
            {/* Left: Round Portrait + Play Badge + Name/Title */}
            <div className="flex flex-col items-center text-center flex-shrink-0">
              <div className="relative w-44 h-44 mb-4">
                <img
                  src={drFahadImg}
                  alt="Dr Fahad Saeed"
                  onError={() => {
                    if (drFahadImg !== "/assets/images/dr-fahad-saeed.png") {
                      setDrFahadImg("/assets/images/dr-fahad-saeed.png");
                    }
                  }}
                  className="w-full h-full rounded-full object-cover filter grayscale contrast-125 shadow-md border-2 border-gray-200"
                />
                {/* Orange Video Badge */}
                <div className="absolute bottom-1 right-1 w-10 h-10 rounded-xl bg-[#d97706] text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>

              <h4 className="text-xl font-heading font-extrabold text-[#1e3a8a] italic tracking-tight mb-0.5">
                Dr Fahad Saeed
              </h4>
              <p className="text-xs font-medium text-gray-600 italic">
                Senior Climate Scientist
              </p>
              <p className="text-xs font-medium text-gray-600 italic">
                Climate Analytics
              </p>
            </div>

            {/* Right: Quote Text */}
            <div className="flex-1 self-center">
              <blockquote className="text-base md:text-xl text-gray-900 font-serif italic leading-relaxed font-normal">
                “1.5 °C limit is not a symbolic benchmark. It is the enduring
                and legally significant goal of Paris Agreement. It is
                established to avoid the most dangerous impacts of climate
                change and in that sense is set as the ethical and moral limit.
                Exceeding it would significantly increase the likelihood of
                severe, widespread and in some cases irreversible impacts.”
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
