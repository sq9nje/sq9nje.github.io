---
title: "Piligrim - Synteza Oleg9"
date: 2012-11-08
categories:
  - Elektronika
  - Krótkofalarstwo
  - Sprzęt
draft: false
---
Budowę swojego Piligrima rozpocząłem od syntezy. Mój wybór nie był zbyt oryginalny i zdecydowałem się na sterownik, który na forum cqham.ru opublikował Oleg9. Sterownik, poza tym, że jest to synteza i dostarcza sygnału LO, posiada wiele funkcji umożliwiających kontrolowanie pracy wielu modułów radia: przełączanie filtrów zależnie od pasma, włączanie tłumików, S-metr, pomiar SWR.  Syntezer nie ma możliwości ustawienia częstotliwości pośredniej, stąd nadaje się tylko do pracy w transciverach z bezpośrednią przemianą częstotliwości.  Wszystkimi funkcjami steruje się za pomocą klawiatury matrycowej 4×3 i enkodera obrotowego.


W urządzeniu jako generator może pracować jeden z układów DDS Analog Devices z rodziny AD9954/AD9952/AD9951 taktowany sygnałem z generatora 80MHz. Sygnał z tego generatora podzielony przez 4 taktuje również mikrokontroler PIC16F877A odpowiedzialny za sterowanie całością. Sygnał z generatora DDS przechodzi przez symetryczny filtr dolnoprzepustowy, a następnie trafia do odbiornika LVDS, który spełnia rolę bardzo szybkiego komparatora. Dzięki temu na wyjściu układu otrzymujemy czysty sygnał prostokątny o stromych zboczach, odpowiedni do sterowania mieszaczem Tayloe’a.

Swoją płytkę wykonałem według projektu udostępnionego przez Adama SP5FCS na forum SPHM. Płytka ta zaprojektowana została w KiCADzie i znakomicie nadaje się do wykonania metodą termotransferu. Montaż nie nastręcza większych trudności. No może poza przylutowaniem termopadu układu AD9951, co wymagało ode mnie trochę gimnastyki, ale się powiodło. Ponieważ pole po bitwie nie wyglądało zbyt pięknie, zasłoniłem je kawałeczkiem pobielonej blaszki przylutowanej do płytki.

W tym samym wątku na SPHM dostępna jest również cała dokumentacja wraz z instrukcją obsługi syntezy przetłumaczona na język polski. Co prawda nie miałem jeszcze okazji używać syntezy w radiu, gdyż ono ciągle powstaje, ale już pobieżne przeglądnięcie tej instrukcji uświadamia jak szerokie są możliwości sterownika i jak przydatny będzie ten dokument.
