# Client Sammlung - Netzdienlichkeit Autostrom

[STROMDAO Autostrom](https://autostrom.stromdao.de) ist ein Stromprodukt für Privathaushalte, inklusive Spezialtarif für Ihr Elektrofahrzeug. Bei netzdienlichen Aufladen ihres Fahrzeugs erhalten Autostromkunden einen Bonus von bis zu fünf Cent je Kilowattstunde.

In diesem Repository werden die Werkzeuge zur Integration (Mobile,Web oder SmartHome) bereitgestellt. Diese können verwendet werden, um den Erhalt der Prämie auf [netzdienliches Laden](https://autostrom.stromdao.de/articles/netzdienlichkeit) zu automatisieren.

## Installation Node JS
```
npm install -g autostrom
```

## Installation Webclient
```
git clone https://github.com/energychain/autostrom-client
```

Ein Beispiel für einen Webclient zur Kommunikation der Zählerstände ist unter `./web-light` zu finden.

## Nutzung von der Kommandozeile
```
stromdao.autostrom help
```

```
stromdao.autostrom start EAUTO 69256 12345678
```
Beginn eines Ladevorgangs für die lokale Kennung `EAUTO` in der Postleitzahl `69256`, deren Netzanschluss einen Zählerstand von `12345678` Watt-Stunden hat.

```
stromdao.autostrom stop EAUTO 69256 12345678 35678
```
Beenden eines Ladevorgangs für die lokale Kennung `EAUTO` in der Postleitzahl `69256`, deren Netzanschluss einen Zählerstand von `12345678` Watt-Stunden hat. Es wurden `35678` Watt-Stunden geladen und sollen für die Prämienberechnung verwendet werden (entspriche 35,678 KWh).

Die Kennung kann beliebig angegeben werden und dient zur Unterscheidung mehrerer Ladepunkte an einem Netzanschluss.

## Tipp
Es kann das [Stromkonto](https://www.stromkonto.net/) verwendet werden, um die Berechnung der Prämie zu kontrollieren und die Funktion der Anwendung.


## Hinweis
Generell kann das Werkzeug auch ohne einen aktiven Tarif bei der **STROM**DAO verwendet werden. Es besteht jedoch dann kein Anspruch auf Auszahlung oder Erstattung der Prämie.

## Feedback/Collaboration
- https://fury.network/
- https://stromdao.de/
- https://gitter.im/stromdao/BusinessObject
