---
title: "Moduł generatora Si5351"
date: 2014-07-04
categories:
  - Elektronika
  - Arduino
  - Krótkofalarstwo
draft: false
---
Czytając [blog Jasona NT7S](http://nt7s.com/) przeczytałem jego posty o układzie Si5351. Jest to sterowany przez I2C programowalny generator sygnału prostokątnego, trochę podobny do Si570. Zakres generowanych częstotliwości to 800kHz do 160MHz, więc do zastosowań krótkofalarskich wprost idealny. Nawet dla detektorów kwadraturowych wymagających sterowania sygnałem o czterokrotnie większej częstotliwości zapewni pokrycie wszystkich pasm HF. Gdyby tego mało, zależnie od wersji, układ zapewnia od 3 o 8 niezależnych wyjść. Wydaje się to być bardzo atrakcyjne, szczególnie w kontekście bardziej rozbudowanych TRXów z wieloma odbiornikami. Można też wykorzystać jeden kanał jako VFO, a drugi jako BFO. W dodatku cena układu jest kilkakrotnie niższa od ceny Si570.

{{< image src="img/si5351+buspirate.jpg" caption="Moduł Si5351 i BusPirate" >}}

## Moduł generatora
Po zebraniu tych informacji moje zainteresowanie sięgnęło zenitu :) Pośpiesznie zamówiłem kilka sztuk układów Si5351A w obudowie MSOP10, stosowne kwarce i zabrałem się za „malowanie” płytki drukowanej testowego modułu. Układ został zaprojektowany w programie EAGLE i zawiera, poza Si5351, stabilizator 3.3V oraz translator poziomów dla magistrali I2C. Dzięki umieszczeniu na płytce konwertera poziomów, możliwe jest sterowanie układu z mikrokontrolerów zasilanych napięciem 5V ([nota  katalogowa Si5351](https://www.silabs.com/support%20documents/technicaldocs/si5351-b.pdf)) nie wspomina, aby wejścia były „5V tolerant”). Sygnały wyjściowe ze wszystkich 3 dostępnych kanałów wyprowadzone są, poprzez kondensatory blokujące składową stałą, na krawędziowe gniazda SMA. Rozkład wyprowadzeń sygnałów sterujących zgodny jest ze złączem modułu Si570 zaprezentowanego przez Adama SP5FCS, co być może ułatwi zastosowanie w Husarku.

{{< image src="img/si5351-schemat.png" caption="Moduł Si5351 - Schemat" >}}
{{< image src="img/si5351-plytka.png" caption="Moduł Si5351 - PCB" >}}

## Sterowanie
Programowanie częstotliwości wyjściowej okazało się nie być sprawą trywialną. Układ w zasadzie nie jest przewidziany do płynnego przestrajania. Jego pierwotnym zastosowaniem ma być generowanie sygnałów taktujących różne elementy systemu: mikrokontrolery, przetworniki ADC i DAC, sensory itp. Aby ułatwić inżynierom wykorzystanie układu w takiej roli producent udostępnił oprogramowanie [ClockBuilder Desktop](https://www.silabs.com/Support%20Documents/Software/ClockBuilderDesktopSwInstallSi5351.zip), które pozwala skonfigurować układ i generuje gotową mapę rejestrów. Dla nas ma on ograniczoną przydatność, ponieważ przy ciągłym przestrajaniu, jak w radiostacjach, zawartość rejestrów musi być generowana dynamicznie.

Pewną pomocą jest nota aplikacyjna [AN619](https://www.silabs.com/support%20documents/technicaldocs/an619.pdf). Opisuje ona metodę ręcznego generowania mapy rejestrów. Podane są tam wzory określające zależności pomiędzy współczynnikami konfiguracyjnymi, a rejestrami. W nocie tej znajduje się też pełny opis wszystkich rejestrów układu Si5351, również tych, które zostały pominięte w karcie katalogowej. Dodatkowe informacje znalazłem również na stronie [YU3MA](http://yu3ma.net/wp/?p=592). Tak uzbrojony napisałem prostą bibliotekę dla Arduino. Można ją pobrać z [GitHub](https://github.com/sq9nje/si5351).

## Do pobrania
*  [Projekt EAGLE](img/SI5351A.zip)