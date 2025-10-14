import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { calculateTimeRemaining, type TimeRemaining } from "@/lib/launchTime";

const CountdownPage = () => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const time = calculateTimeRemaining();
      setTimeRemaining(time);

      if (time.isExpired) {
        clearInterval(interval);
        navigate("/form");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Shared background component (same as form)
  const backgroundShapes = (
    <div className="absolute inset-0">
      {/* Large shapes */}
      <div className="absolute -top-32 -left-32 w-[55vw] h-[55vw] md:w-[22vw] md:h-[22vw] bg-blue-400/15 rounded-full animate-float-slow" style={{'--float-x': '1.5vw', '--float-y': '1.2vw'} as React.CSSProperties}></div>
      <div className="absolute top-1/4 right-0 w-[70vw] h-[70vw] md:w-[30vw] md:h-[30vw] bg-blue-500/10 rounded-full animate-float-reverse" style={{'--float-x': '-2vw', '--float-y': '1.8vw'} as React.CSSProperties}></div>
      <div className="absolute -bottom-48 left-1/3 w-[60vw] h-[60vw] md:w-[25vw] md:h-[25vw] bg-blue-600/12 rounded-full animate-float-slow" style={{'--float-x': '1.5vw', '--float-y': '-1vw'} as React.CSSProperties}></div>
      <div className="absolute top-1/2 right-1/4 w-[58vw] h-[58vw] md:w-[24vw] md:h-[24vw] bg-blue-300/14 rounded-full animate-float-reverse" style={{'--float-x': '-1.8vw', '--float-y': '-1.5vw'} as React.CSSProperties}></div>
      <div className="absolute top-[5%] right-[45%] w-[65vw] h-[65vw] md:w-[28vw] md:h-[28vw] bg-blue-400/11 rounded-full animate-float-slow" style={{'--float-x': '1.6vw', '--float-y': '1.4vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-[10%] right-[8%] w-[62vw] h-[62vw] md:w-[26vw] md:h-[26vw] bg-blue-600/13 rounded-full animate-float-reverse" style={{'--float-x': '-1.7vw', '--float-y': '-1.3vw'} as React.CSSProperties}></div>
      <div className="absolute top-[18%] left-[48%] w-[63vw] h-[63vw] md:w-[27vw] md:h-[27vw] bg-blue-500/12 rounded-full animate-float-slow" style={{'--float-x': '1.5vw', '--float-y': '1.6vw'} as React.CSSProperties}></div>

      {/* Medium squares and rectangles */}
      <div className="absolute top-20 left-1/4 w-[38vw] h-[38vw] md:w-[15vw] md:h-[15vw] bg-blue-300/18 rotate-12 animate-float-reverse" style={{'--float-x': '-1.5vw', '--float-y': '1.2vw', '--rotate-start': '12deg', '--rotate-end': '24deg'} as React.CSSProperties}></div>
      <div className="absolute bottom-32 right-1/4 w-[45vw] h-[28vw] md:w-[19vw] md:h-[11vw] bg-blue-500/15 -rotate-6 animate-float-slow" style={{'--float-x': '1.8vw', '--float-y': '-1.5vw', '--rotate-start': '-6deg', '--rotate-end': '8deg'} as React.CSSProperties}></div>
      <div className="absolute top-1/3 right-1/3 w-[32vw] h-[32vw] md:w-[13vw] md:h-[13vw] bg-blue-400/20 rotate-45 animate-float-reverse" style={{'--float-x': '-1.2vw', '--float-y': '1.6vw', '--rotate-start': '45deg', '--rotate-end': '60deg'} as React.CSSProperties}></div>
      <div className="absolute bottom-1/4 left-10 w-[40vw] h-[26vw] md:w-[16vw] md:h-[10.5vw] bg-blue-600/16 rotate-[20deg] animate-float-slow" style={{'--float-x': '1.4vw', '--float-y': '1.5vw', '--rotate-start': '20deg', '--rotate-end': '35deg'} as React.CSSProperties}></div>
      <div className="absolute top-[15%] right-[15%] w-[35vw] h-[35vw] md:w-[14vw] md:h-[14vw] bg-blue-500/17 animate-float-reverse" style={{'--float-x': '-1.6vw', '--float-y': '1.4vw'} as React.CSSProperties}></div>
      <div className="absolute top-[65%] left-[20%] w-[30vw] h-[42vw] md:w-[12vw] md:h-[17vw] bg-blue-400/14 rotate-[15deg] animate-float-slow" style={{'--float-x': '1.4vw', '--float-y': '-1.3vw', '--rotate-start': '15deg', '--rotate-end': '28deg'} as React.CSSProperties}></div>
      <div className="absolute top-[45%] left-[5%] w-[42vw] h-[32vw] md:w-[17vw] md:h-[13vw] bg-blue-300/16 -rotate-[10deg] animate-float-reverse" style={{'--float-x': '-1.5vw', '--float-y': '1.4vw', '--rotate-start': '-10deg', '--rotate-end': '5deg'} as React.CSSProperties}></div>
      <div className="absolute bottom-[40%] right-[5%] w-[35vw] h-[44vw] md:w-[14vw] md:h-[18vw] bg-blue-500/14 rotate-[28deg] animate-float-slow" style={{'--float-x': '1.6vw', '--float-y': '-1.4vw', '--rotate-start': '28deg', '--rotate-end': '42deg'} as React.CSSProperties}></div>
      <div className="absolute top-[35%] right-[50%] w-[40vw] h-[40vw] md:w-[16vw] md:h-[16vw] bg-blue-600/15 rotate-[8deg] animate-float-reverse" style={{'--float-x': '-1.3vw', '--float-y': '1.5vw', '--rotate-start': '8deg', '--rotate-end': '22deg'} as React.CSSProperties}></div>
      <div className="absolute bottom-[55%] left-[45%] w-[44vw] h-[30vw] md:w-[18vw] md:h-[12vw] bg-blue-400/13 -rotate-[18deg] animate-float-slow" style={{'--float-x': '1.5vw', '--float-y': '1.3vw', '--rotate-start': '-18deg', '--rotate-end': '-4deg'} as React.CSSProperties}></div>
      <div className="absolute top-[52%] left-[72%] w-[38vw] h-[35vw] md:w-[15vw] md:h-[14vw] bg-blue-500/16 rotate-[32deg] animate-float-reverse" style={{'--float-x': '-1.4vw', '--float-y': '1.6vw', '--rotate-start': '32deg', '--rotate-end': '18deg'} as React.CSSProperties}></div>

      {/* Small shapes */}
      <div className="absolute top-40 right-20 w-[12vw] h-[12vw] md:w-[4vw] md:h-[4vw] bg-blue-300/25 rounded-full animate-float-slow" style={{'--float-x': '1vw', '--float-y': '1.1vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-20 left-20 w-[10vw] h-[16vw] md:w-[3vw] md:h-[6vw] bg-blue-600/20 rotate-12 animate-float-reverse" style={{'--float-x': '-0.8vw', '--float-y': '-0.9vw', '--rotate-start': '12deg', '--rotate-end': '-6deg'} as React.CSSProperties}></div>
      <div className="absolute top-1/2 left-10 w-[14vw] h-[14vw] md:w-[5vw] md:h-[5vw] bg-blue-500/22 animate-float-slow" style={{'--float-x': '1.1vw', '--float-y': '1.2vw'} as React.CSSProperties}></div>
      <div className="absolute top-2/3 right-10 w-[20vw] h-[20vw] md:w-[7.5vw] md:h-[7.5vw] bg-blue-400/18 rounded-full animate-float-reverse" style={{'--float-x': '-1.1vw', '--float-y': '1.5vw'} as React.CSSProperties}></div>
      <div className="absolute top-[10%] left-[40%] w-[13vw] h-[13vw] md:w-[4.5vw] md:h-[4.5vw] bg-blue-300/21 animate-float-slow" style={{'--float-x': '1.1vw', '--float-y': '-1.2vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-[30%] right-[35%] w-[11vw] h-[18vw] md:w-[3.5vw] md:h-[7vw] bg-blue-600/19 rotate-[25deg] animate-float-reverse" style={{'--float-x': '-1vw', '--float-y': '1.1vw', '--rotate-start': '25deg', '--rotate-end': '12deg'} as React.CSSProperties}></div>
      <div className="absolute top-[25%] left-[60%] w-[16vw] h-[16vw] md:w-[6vw] md:h-[6vw] bg-blue-500/16 rounded-full animate-float-slow" style={{'--float-x': '1.2vw', '--float-y': '1.1vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-[15%] left-[55%] w-[15vw] h-[10vw] md:w-[5.5vw] md:h-[3.5vw] bg-blue-400/20 animate-float-reverse" style={{'--float-x': '-1.1vw', '--float-y': '-1.2vw'} as React.CSSProperties}></div>
      <div className="absolute top-[8%] left-[15%] w-[18vw] h-[18vw] md:w-[6.5vw] md:h-[6.5vw] bg-blue-300/23 rounded-full animate-float-slow" style={{'--float-x': '1.1vw', '--float-y': '1vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-[8%] right-[22%] w-[12vw] h-[20vw] md:w-[4vw] md:h-[7.5vw] bg-blue-600/21 rotate-[16deg] animate-float-reverse" style={{'--float-x': '-1vw', '--float-y': '-1.1vw', '--rotate-start': '16deg', '--rotate-end': '4deg'} as React.CSSProperties}></div>
      <div className="absolute top-[50%] right-[12%] w-[15vw] h-[15vw] md:w-[5.5vw] md:h-[5.5vw] bg-blue-500/20 animate-float-slow" style={{'--float-x': '1.2vw', '--float-y': '-1.1vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-[48%] left-[8%] w-[18vw] h-[12vw] md:w-[7vw] md:h-[4vw] bg-blue-400/19 rotate-[10deg] animate-float-reverse" style={{'--float-x': '-1.1vw', '--float-y': '1.2vw', '--rotate-start': '10deg', '--rotate-end': '-5deg'} as React.CSSProperties}></div>
      <div className="absolute top-[60%] right-[58%] w-[16vw] h-[16vw] md:w-[6vw] md:h-[6vw] bg-blue-600/18 rounded-full animate-float-slow" style={{'--float-x': '1vw', '--float-y': '1.1vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-[62%] left-[68%] w-[14vw] h-[20vw] md:w-[5vw] md:h-[8vw] bg-blue-300/17 -rotate-[8deg] animate-float-reverse" style={{'--float-x': '-1.2vw', '--float-y': '-1vw', '--rotate-start': '-8deg', '--rotate-end': '6deg'} as React.CSSProperties}></div>
      <div className="absolute top-[72%] left-[35%] w-[13vw] h-[13vw] md:w-[4.5vw] md:h-[4.5vw] bg-blue-500/22 animate-float-slow" style={{'--float-x': '1.1vw', '--float-y': '-1.2vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-[75%] right-[42%] w-[11vw] h-[16vw] md:w-[3.5vw] md:h-[6vw] bg-blue-400/20 rotate-[22deg] animate-float-reverse" style={{'--float-x': '-0.9vw', '--float-y': '1.1vw', '--rotate-start': '22deg', '--rotate-end': '10deg'} as React.CSSProperties}></div>
      <div className="absolute top-[38%] left-[82%] w-[14vw] h-[14vw] md:w-[5vw] md:h-[5vw] bg-blue-600/21 rounded-full animate-float-slow" style={{'--float-x': '1vw', '--float-y': '1.2vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-[42%] right-[68%] w-[13vw] h-[18vw] md:w-[4.5vw] md:h-[7vw] bg-blue-500/19 rotate-[14deg] animate-float-reverse" style={{'--float-x': '-1.1vw', '--float-y': '-1vw', '--rotate-start': '14deg', '--rotate-end': '2deg'} as React.CSSProperties}></div>
      <div className="absolute top-[82%] right-[28%] w-[16vw] h-[16vw] md:w-[6vw] md:h-[6vw] bg-blue-400/18 animate-float-slow" style={{'--float-x': '1.2vw', '--float-y': '-1.1vw'} as React.CSSProperties}></div>
      <div className="absolute bottom-[88%] left-[58%] w-[14vw] h-[10vw] md:w-[5vw] md:h-[3vw] bg-blue-300/22 rotate-[20deg] animate-float-reverse" style={{'--float-x': '-1vw', '--float-y': '1.2vw', '--rotate-start': '20deg', '--rotate-end': '8deg'} as React.CSSProperties}></div>
    </div>
  );

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0052D4] via-[#1e3a8a] to-[#1e293b]">
      {backgroundShapes}

      <div className="max-w-6xl w-full space-y-8 md:space-y-12 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <img
            src="/fluxathon.png"
            alt="FLUXathon"
            className="h-24 sm:h-32 mx-auto mb-8"
          />
        </div>

        {/* Countdown Section */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-wider pt-8" style={{ fontFamily: 'Silkscreen, monospace', fontWeight: 400, color: '#316EFF' }}>
            FIRST 20 TEAMS
          </h1>

          {/* Countdown Timer */}
          <div className="flex items-end justify-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 pb-12">
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl" style={{ fontFamily: 'Roboto Mono', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%', color: '#316EFF' }}>
                {formatNumber(timeRemaining.days)}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2" style={{ fontFamily: 'Roboto Mono, monospace', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.57)' }}>
                DAYS
              </div>
            </div>

            <div className="text-4xl sm:text-5xl md:text-6xl pb-4 sm:pb-6 md:pb-7" style={{ fontFamily: 'Roboto Mono', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%', color: 'rgba(255, 255, 255, 0.57)' }}>
              :
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl" style={{ fontFamily: 'Roboto Mono', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%', color: '#316EFF' }}>
                {formatNumber(timeRemaining.hours)}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2" style={{ fontFamily: 'Roboto Mono, monospace', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.57)' }}>
                HOURS
              </div>
            </div>

            <div className="text-4xl sm:text-5xl md:text-6xl pb-4 sm:pb-6 md:pb-7" style={{ fontFamily: 'Roboto Mono', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%', color: 'rgba(255, 255, 255, 0.57)' }}>
              :
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl" style={{ fontFamily: 'Roboto Mono', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%', color: '#316EFF' }}>
                {formatNumber(timeRemaining.minutes)}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2" style={{ fontFamily: 'Roboto Mono, monospace', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.57)' }}>
                MINUTES
              </div>
            </div>

            <div className="text-4xl sm:text-5xl md:text-6xl pb-4 sm:pb-6 md:pb-7" style={{ fontFamily: 'Roboto Mono', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%', color: 'rgba(255, 255, 255, 0.57)' }}>
              :
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl" style={{ fontFamily: 'Roboto Mono', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%', color: '#316EFF' }}>
                {formatNumber(timeRemaining.seconds)}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2" style={{ fontFamily: 'Roboto Mono, monospace', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.57)' }}>
                SECONDS
              </div>
            </div>
          </div>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
          {/* Thursday Card */}
          <Card className="p-6 space-y-4 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl text-white uppercase" style={{ fontFamily: 'Silkscreen', fontWeight: 400, letterSpacing: '0.05em' }}>
                Thursday
              </h2>
              <span className="text-xl text-white" style={{ fontFamily: 'Silkscreen', fontWeight: 400 }}>
                23
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Roboto Mono, monospace' }}>Google Workshop</h3>
              <p className="text-sm text-white/80" style={{ fontFamily: 'Roboto Mono, monospace' }}>5:00-7:00</p>
              <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                Contestants will kick-off with an individual workshop with Russ from Google. What you create can be used in your team's final project.
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>
              <MapPin className="w-4 h-4" />
              <span>Deloitte Welcome Center</span>
            </div>
          </Card>

          {/* Friday Card */}
          <Card className="p-6 space-y-4 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl text-white uppercase" style={{ fontFamily: 'Silkscreen', fontWeight: 400, letterSpacing: '0.05em' }}>
                Friday
              </h2>
              <span className="text-xl text-white" style={{ fontFamily: 'Silkscreen', fontWeight: 400 }}>
                24
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Roboto Mono, monospace' }}>Shed Session</h3>
              <p className="text-sm text-white/80" style={{ fontFamily: 'Roboto Mono, monospace' }}>4:00-7:00</p>
              <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                Work time will be hosted at The Shed with SCADamp. Come to get help with pitching and troubleshoot any remaining issues.
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>
              <MapPin className="w-4 h-4" />
              <span>The Shed</span>
            </div>
          </Card>

          {/* Saturday Card */}
          <Card className="p-6 space-y-4 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl text-white uppercase" style={{ fontFamily: 'Silkscreen', fontWeight: 400, letterSpacing: '0.05em' }}>
                Saturday
              </h2>
              <span className="text-xl text-white" style={{ fontFamily: 'Silkscreen', fontWeight: 400 }}>
                25
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Roboto Mono, monospace' }}>Finals</h3>
              <p className="text-sm text-white/80" style={{ fontFamily: 'Roboto Mono, monospace' }}>12:00</p>
              <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                Final submissions are due. Five teams will be chosen to present in the Finals to be judged by Russ.
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>
              <MapPin className="w-4 h-4" />
              <span>Poetter Hall</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CountdownPage;
