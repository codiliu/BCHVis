#! usr/bin/python
#coding=utf-8   
import tornado.web
import pickle
from read.datareader import DataReader
import time
import json
import datetime
import math
import types
import numpy as np
import uuid
from sklearn.decomposition import PCA
from operator import itemgetter

g_DataReader = DataReader();
# g_PointWriter = PointWriter();

airlineMap={'APG': 'Air People International', 'GUY': 'Air Guyane Express', 'KAL': 'Korean Air', 'KMF': 'Kam Air', 'MAS': 'Malaysia Airlines', 'LHN': 'Express One International', 'KMZ': 'Comores Aviation', 'SKP': 'Skytrans Airlines', 'VTA': 'Air Tahiti', 'ERH': 'Era Aviation', 'PNR': 'PAN Air', 'BAB': 'Bahrain Air', 'JOL': 'Atyrau Air Ways', 'OMA': 'Oman Air', 'WIG': 'Wiggins Airways', 'MYW': 'MyAir', 'NAO': 'North American Airlines', 'DKN': 'Kingfisher Red', 'UGX': 'East African', 'PAG': 'Perimeter Aviation (Perimeter Airlines)', 'GLO': 'Gol Transportes Aéreos', 'AAL': 'American Airlines', 'BEA': 'Best Air', 'HKA': 'Superior Aviation', 'NOS': 'Neos', 'VRD': 'Virgin America', 'NIG': 'Aero Contractors', 'IZM': 'Izair', 'LAA': 'Libyan Airlines', 'CES': 'China Eastern Airlines', 'UMK': 'Yuzmashavia', 'NOV': 'Nova Airline', 'HSV': 'Direktflyg', 'VBW': 'Air Burkina', 'AEB': 'Aero Benin', 'IMP': 'Hellenic Imperial Airways', 'TAR': 'Tunisair', 'JLJ': 'J-Air', 'ASQ': 'Atlantic Southeast Airlines', 'PVV': 'Continental Airways', 'ERT': 'Eritrean Airlines', 'APW': 'Arrow Air', 'MPE': 'Canadian North', 'LOT': 'LOT Polish Airlines', 'VLO': 'Varig Logistica (VarigLog)', 'PWF': 'Private Wings Flugcharter', 'ACI': 'Aircalin (Air Caledonie International)', 'SPM': 'Air Saint Pierre', 'SEQ': 'Sky Eyes', 'CRQ': 'Air Creebec', 'PAS': 'Pelita Air Service', 'IBB': 'Binter Canarias', 'QTR': 'Qatar Airways', 'VAL': 'Voyageur Airways', 'BEL': 'Brussels Airlines', 'ECA': 'Eurocypria Airlines', 'TZT': 'Air Zambezi', 'ATI': 'Aero-Tropics Air Services', 'ISW': 'Islas Airways', 'TGW': 'Tiger Airways', 'BBR': 'Santa Barbara Airlines', 'DAL': 'Delta Air Lines', 'CBB': 'Cargo B Airlines', 'ICD': 'Icaro Air', 'BMR': 'BMI Regional', 'STU': 'Servicios de Transportes Aereos Fueguinos', 'GLG': 'Aerolineas Galapagos (Aerogal)', 'SCX': 'Sun Country Airlines', 'NCH': 'Chanchangi Airlines', 'RPH': 'Republic Express Airlines', 'AXM': 'AirAsia', 'DHL': 'Astar Air Cargo', 'JAZ': 'JALways', 'PCE': 'Pace Airlines', 'GOW': 'GoAir', 'ANS': 'Andes Líneas Aéreas', 'BTV': 'Batavia Air', 'BBD': 'Bluebird Cargo', 'ELY': 'El Al Israel Airlines', 'BCS': 'European Air Transport', 'WOA': 'World Airways', 'AZA': 'Alitalia', 'HKE': 'Hong Kong Express Airways', 'TUI': 'TUIfly', 'UCR': 'Aero-Charter Ukraine', 'GFT': 'Gulfstream International Airlines', 'NTN': 'National Airways', 'TWE': 'Transwede Airways', 'URJ': 'Star Air Aviation', 'BZH': 'Brit Air', 'MSI': 'Motor Sich', 'DER': 'Deer Jet', 'LCO': 'LAN Cargo', 'AKX': 'Air Nippon Network Co. Ltd.', 'HEJ': 'Hellas Jet', 'DNV': 'Aeroflot-Don', 'SCH': 'CHC Airways', 'VUR': 'VIP Ecuador', 'AVI': "L'Avion", 'AEE': 'Aegean Airlines', 'AIC': 'Air India', 'KLM': 'KLM Royal Dutch Airlines', 'EXL': 'Sunshine Express Airlines', 'NAY': 'Navegacion y Servicios Aéreos Canarios (NAYSA)', 'COA': 'Continental Airlines', 'JOS': 'DHL de Guatemala', 'BSK': 'Miami Air International', 'SDY': 'Island Express', 'SQC': 'Singapore Airlines Cargo', 'BLE': 'Blue Line', 'LTU': 'LTU International', 'ARE': 'Aires, Aerovias de Integracion Regional, S.A.', 'VLG': 'Vueling Airlines', 'FPO': 'Europe Airpost', 'SVK': 'Air Slovakia', 'HPA': 'Pearl Airways', 'SIA': 'Singapore Airlines', 'POE': 'Porter Airlines', 'CLX': 'Cargolux', 'CSA': 'Czech Airlines', 'AYT': 'Ayit Aviation and Tourism', 'VEC': 'Venezolana', 'FHY': 'Freebird Airlines', 'DIR': 'Dirgantara Air Service', 'AVN': 'Air Vanuatu', 'CAL': 'China Airlines', 'SKX': 'Skyways Express', 'AXB': 'Air India Express', 'ANA': 'All Nippon Airways', 'TMG': 'Tri-MG Intra Asia Airlines', 'CCI': 'Capital Cargo International Airlines', 'MYD': 'Maya Island Air', 'BDA': 'Blue Dart Aviation', 'BRI': 'Brindabella Airlines', 'JTA': 'Japan Transocean Air', 'ASE': 'Airstars', 'GWY': 'USA 3000 Airlines', 'NXA': 'Air Next', 'FAJ': 'Air Fiji', 'XAK': 'Airkenya Express', 'AAW': 'Afriqiyah Airways', 'NAC': 'Northern Air Cargo', 'ESY': 'EasyFly', 'GWI': 'Germanwings', 'UBD': 'United Airways (Bangladesh)', 'GOT': 'WaltAir', 'MLD': 'Air Moldova', 'AXK': 'African Express Airways', 'LMT': 'Almaty Aviation', 'IAW': 'Iraqi Airways', 'TSC': 'Air Transat', 'XAX': 'AirAsia X', 'SEY': 'Air Seychelles', 'FLI': 'Atlantic Airways', 'MNO': 'Mango', 'DNM': 'Denim Air', 'ABQ': 'airblue', 'UEA': 'United Eagle Airlines', 'EIA': 'Evergreen International Airlines', 'CUA': 'China United Airlines', 'VRN': 'VRG Linhas Aereas (VARIG)', 'TUP': 'Aviastar-TU', 'EJA': 'NetJets', 'ORB': 'Orenair (Orenburg Airlines)', 'IRK': 'Kish Air', 'EXV': 'Expo Aviation', 'ITK': 'Interlink Airlines', 'TAM': 'TAM Airlines (TAM Linhas Aereas)', 'CFE': 'BA CityFlyer', 'MUA': 'National Airlines', 'BLS': 'Bearskin Lake Air Service', 'TWN': 'Avialeasing Aviation Company', 'AIE': 'Air Inuit', 'TVR': 'Tavrey Airlines', 'CPA': 'Cathay Pacific', 'SSQ': 'Sunstate Airlines', 'LER': 'LASER Airlines', 'SNG': 'Air Senegal International', 'JLL': 'JetLite', 'BTI': 'Air Baltic', 'CHB': 'China West Air', 'BVT': 'Berjaya Air', 'NZM': 'Mount Cook Airlines', 'AJT': 'Amerijet International', 'AWQ': 'Indonesia AirAsia', 'TAK': 'Tatarstan Airlines', 'CGL': 'Seagle Air', 'ICL': 'CAL Cargo Air Lines', 'SPA': 'Sierra Pacific Airlines', 'GCR': 'Grand China Express Air', 'RFR': 'Royal Air Force', 'MTZ': 'Mali Airways', 'AGV': 'Air Glaciers', 'AWC': 'Titan Airways', 'LOF': 'Trans States Airlines', 'EXY': 'South African Express', 'ONE': 'Oceanair', 'CRK': 'Hong Kong Airlines', 'JCS': 'Jetclub', 'JOR': 'Blue Air', 'VIK': 'Viking Airlines', 'DSM': 'LAN Argentina', 'ABE': 'Aban Air', 'HWY': 'Highland Airways', 'URN': 'Turan Air', 'TMA': 'Trans Mediterranean Airlines', 'SOZ': 'Sat Airlines', 'LNK': 'Airlink', 'ABR': 'Air Contractors', 'SYL': 'Yakutia Airlines', 'BBO': 'Flybaboo', 'LVG': 'Livingston Energy Flight', 'CDP': 'Aero Condor Peru', 'HMS': 'Hemus Air', 'MGL': 'MIAT Mongolian Airlines', 'FSC': 'Four Star Aviation / Four Star Cargo', 'OLA': 'Overland Airways', 'JEA': 'Jet Air', 'VNZ': 'Tbilaviamsheni', 'UKW': 'Lviv Airlines', 'BRG': 'Bering Air', 'IBZ': 'International Business Air', 'ABS': 'Transwest Air', 'KYV': 'Cyprus Turkish Airlines (KTHY Kibris Turk Hava Yollari)', 'GAP': 'Air Philippines', 'TXC': 'TransAVIAexport Airlines', 'RAE': 'Regional Compagnie Aerienne Europeenne', 'JAF': 'Jetairfly', 'AFG': 'Ariana Afghan Airlines', 'SMY': 'Sama Airlines', 'IDA': 'Indonesia Air Transport', 'LIA': 'Leeward Islands Air Transport', 'CAO': 'Air China Cargo', 'LKE': 'Lucky Air', 'EZS': 'easyJet Switzerland', 'ABB': 'Business Aviation', 'ANE': 'Air Nostrum', 'CAV': 'Calm Air', 'PNF': 'Panafrican Airways', 'RSU': 'Aerosur', 'RIT': 'Zest Airways', 'AAR': 'Asiana Airlines', 'TGZ': 'Georgian Airways', 'AAG': 'Air Atlantique', 'VIR': 'Virgin Atlantic Airways', 'THE': 'Toumaï Air Tchad', 'WJA': 'WestJet', 'ETD': 'Etihad Airways', 'AZU': 'Azul Brazilian Airlines', 'AVJ': 'Avia Traffic Company', 'AZQ': 'Silk Way Airlines', 'MNB': 'MNG Airlines', 'CGK': 'Click Airways', 'CSN': 'China Southern Airlines', 'BGH': 'BH Air (Balkan Holidays)', 'AIJ': 'Interjet', 'BMM': 'Atlas Blue', 'SBI': 'S7 Airlines (Siberia Airlines)', 'UPS': 'United Parcel Service', 'RWD': 'Rwandair Express', 'MNJ': 'Menajet', 'CBC': 'Caribair', 'ABV': 'Antrak Air', 'CKK': 'China Cargo Airlines', 'GHB': 'Ghana International Airlines', 'NAX': 'Norwegian Air Shuttle', 'DTA': 'TAAG Angola Airlines (Linhas Aéreas de Angola)', 'PRF': 'Precision Air', 'AJM': 'Air Jamaica', 'KNE': 'Nas Air', 'GGN': 'Air Georgian', 'UKS': 'Ukrainian Cargo Airways', 'FDX': 'FedEx Express', 'LTR': 'Lufttransport', 'MLR': 'Mihin Lanka', 'SKY': 'Skymark Airlines', 'LRC': 'LACSA', 'PIA': 'Pakistan International Airlines', 'FFV': 'Fly540', 'CHQ': 'Chautauqua Airlines', 'SNJ': 'Skynet Asia Airways', 'CFS': 'Empire Airlines', 'TMW': 'Trans Maldivian Airways', 'IOS': 'Isles of Scilly Skybus', 'EWG': 'Eurowings', 'DTR': 'DAT Danish Air Transport', 'RKH': 'Royal Khmer Airlines', 'VVM': 'Viva Macau', 'BNX': 'LAI - Linea Aerea IAACA', 'LBT': 'Nouvelair', 'SZL': 'Swaziland Airlink', 'BTA': 'ExpressJet Airlines', 'MDV': 'Moldavian Airlines', 'WZZ': 'Wizz Air', 'ETS': 'Avitrans', 'DLH': 'Lufthansa', 'BGL': 'Benin Golf Air', 'AHA': 'Air Alpha Greenland', 'VOZ': 'Virgin Blue', 'HER': "Hex'Air", 'CJC': 'Colgan Air', 'GBK': 'Gabon Airlines', 'HOA': 'Hola Airlines', 'NEA': 'New England Airlines', 'PJS': 'Jet Aviation', 'TUA': 'Turkmenistan Airlines', 'FAB': 'First Air', 'HSA': 'East African Safari Air Express', 'ROI': 'Avior Airlines', 'RPA': 'Republic Airlines', 'CMI': 'Continental Micronesia', 'TOM': 'Thomson Airways', 'PAO': 'Polynesian Airlines', 'LGW': 'Luftfahrtgesellschaft Walter', 'OTG': 'One-Two-GO Airlines', 'JUB': 'Jubba Airways', 'GBA': 'Gulf Air Bahrain', 'SWG': 'Sunwing Airlines', 'ALK': 'SriLankan Airlines', 'JET': 'Wind Jet', 'ESL': 'Russian Sky Airlines', 'XME': 'Australian air Express', 'DRU': 'Alrosa Mirny Air Enterprise', 'KRT': 'Air Kokshetau', 'SDM': 'Rossiya - Russian Airlines', 'CRL': 'Corsairfly', 'CVA': 'Air Chathams', 'SKZ': 'Skyway Enterprises', 'MDM': 'Medavia', 'AMF': 'Ameriflight', 'BFL': 'Buffalo Airways', 'DAG': 'Dagestan Airlines', 'OTL': 'South Airlines', 'UGA': 'Air Uganda', 'CDG': 'Shandong Airlines', 'MVD': 'Kavminvodyavia', 'NKF': 'Barents AirLink', 'ADE': 'Ada Air', 'MPX': 'Aeromexpress', 'SHY': 'Sky Airlines', 'BIE': 'Air Mediterranee', 'GES': 'Gestair', 'SRU': 'Star Perú', 'LNI': 'Lion Air (Lion Mentari Airlines )', 'UBA': 'Myanmar Airways International', 'ACK': 'Nantucket Airlines', 'PAL': 'Philippine Airlines', 'WEB': 'WebJet Linhas Aéreas', 'MAT': 'Maldivian Air Taxi', 'ACP': 'Astral Aviation', 'TAY': 'TNT Airways', 'KKK': 'Atlasjet', 'BLV': 'Bellview Airlines', 'NSO': 'Aerolineas Sosa', 'GMT': 'Magnicharters', 'FWA': 'Interstate Airline', 'PSV': 'Servicios Aereos Profesionales', 'HKS': 'CHC Helikopter Service', 'FDN': 'Dolphin Air', 'ERG': 'Aviaenergo', 'MAA': 'MasAir', 'MPD': 'Air Comet', 'TSO': 'Transaero Airlines', 'BMA': 'bmi', 'SAI': 'Shaheen Air International', 'VCV': 'Conviasa', 'PGT': 'Pegasus Airlines', 'VXG': 'Avirex', 'CXP': 'Xtra Airways', 'CSC': 'Sichuan Airlines', 'LLM': 'Yamal Airlines', 'BES': 'Aero Services Executive', 'TOS': 'Tropic Air', 'WIA': 'Windward Islands Airways', 'VLK': 'Vladivostok Air', 'KOR': 'Air Koryo', 'CPN': 'Caspian Airlines', 'KBA': 'Kenn Borek Air', 'SAT': 'SATA Air Acores', 'GSM': 'Flyglobespan', 'HAG': 'Hageland Aviation Services', 'CEB': 'Cebu Pacific', 'QCL': 'Air Class Lineas Aereas', 'KQA': 'Kenya Airways', 'THY': 'Turkish Airlines', 'VAP': 'Phuket Air', 'ANO': 'Airnorth', 'CJT': 'Cargojet Airways', 'KEN': 'Kenmore Air', 'TOB': 'Tobruk Air', 'KAJ': 'Karthago Airlines', 'AIQ': 'Thai AirAsia', 'SRR': 'Star Air', 'OST': 'Alania Airlines', 'BOS': 'OpenSkies', 'PDT': 'Piedmont Airlines', 'BLX': 'TUIfly Nordic', 'AUL': 'Aeroflot-Nord', 'ISV': 'Islena De Inversiones', 'DWT': 'Darwin Airline', 'FJI': 'Air Pacific', 'MCM': 'Heli Air Monaco', 'OAW': 'Helvetic Airways', 'RPK': 'Royal Airlines', 'BCI': 'Blue Islands', 'FRL': 'Freedom Airlines', 'VIV': 'VivaAerobus', 'NCA': 'Nippon Cargo Airlines', 'MCK': 'Macair Airlines', 'CBE': 'MexicanaClick', 'CYZ': 'China Postal Airlines', 'IKA': 'Gorkha Airlines', 'JIA': 'PSA Airlines', 'APP': 'Aeroperlas', 'KIL': 'Kuban Airlines', 'SAY': 'ScotAirways', 'CFG': 'Condor Flugdienst', 'FPY': "Compagnie Africaine d'Aviation", 'DAH': 'Air Algerie', 'MXL': 'Maxair', 'AYZ': 'Atlant-Soyuz Airlines', 'VES': 'Vieques Air Link', 'PGP': 'Perm Airlines', 'SYR': 'Syrian Arab Airlines (Syrianair)', 'AHK': 'Air Hong Kong', 'AZS': 'Aviacon Zitotrans', 'PIC': 'Jetstar Pacific', 'UDN': 'Dniproavia', 'DJB': 'Djibouti Airlines', 'SNC': 'Air Cargo Carriers', 'KNI': 'KD Avia', 'RVL': 'Air Vallée', 'SHU': 'SAT Airlines', 'CRG': 'Cargoitalia', 'NFA': 'Air Norway', 'SAX': 'Sabah Air', 'AMB': 'DRF Luftrettung', 'CIU': 'Cielos Airlines', 'AUH': 'Abu Dhabi Amiri Flight', 'AXF': 'Asian Express Airlines', 'RCF': 'Aeroflot-Cargo', 'MNG': 'Aero Mongolia', 'VGN': 'Virgin Nigeria Airways', 'TGN': 'Trigana Air Service', 'VLE': 'Volare Airlines', 'MKU': 'Island Air', 'GXL': 'XL Airways Germany', 'CLU': 'Triple Alpha Luftfahrtgesellschaft', 'CPZ': 'Compass Airlines', 'BOT': 'Air Botswana', 'NSE': 'SATENA', 'MDW': 'Midway Airlines', 'NWL': 'North-Wright Airways', 'SAS': 'Scandinavian Airlines System (SAS)', 'ZAK': 'Zambia Skyways', 'BOX': 'AeroLogic', 'SXS': 'SunExpress', 'VAZ': 'Red Wings Airlines', 'AJX': 'Air Japan', 'MAH': 'Malev Hungarian Airlines', 'ANG': 'Air Niugini', 'PCO': 'Pacific Coastal Airline', 'DHX': 'DHL International Aviation ME', 'TUD': 'Flight Alaska', 'FIF': 'Air Finland', 'SEH': 'Sky Express', 'CLI': 'Clickair', 'OKA': 'Okay Airways', 'GRL': 'Air Greenland', 'CXI': 'Shanxi Airlines', 'AFR': 'Air France', 'FTA': 'Frontier Flying Service', 'VOA': 'Viaggio Air', 'ABX': 'ABX Air', 'QNZ': 'JetConnect', 'KHO': 'Khors Aircompany', 'HHI': 'Hamburg International', 'AIZ': 'Arkia Israel Airlines', 'TIW': 'Transcarga', 'CQN': 'Chongqing Airlines', 'JNA': 'Jin Air', 'RJA': 'Royal Jordanian', 'GRO': 'Allegro', 'TUY': 'Linea Turistica Aerotuy', 'TLR': 'Air Libya', 'USH': 'US Helicopter', 'RYR': 'Ryanair', 'OCA': 'Aserca Airlines', 'AZW': 'Air Zimbabwe', 'GAO': 'Golden Air', 'SKW': 'SkyWest Airlines', 'IBE': 'Iberia Airlines', 'SLM': 'Surinam Airways', 'UAE': 'Emirates Airline', 'PMW': 'Paramount Airways', 'UTA': 'UTair Aviation', 'CTT': 'Custom Air Transport', 'SUS': 'Sun Air of Scandinavia', 'CSZ': 'Shenzhen Airlines', 'RSI': 'Air Sunshine', 'MDL': 'Mandala Airlines', 'AMU': 'Air Macao', 'SSV': 'Skyservice Airlines', 'COY': 'Coyne Aviation', 'ASH': 'go!', 'RLA': 'Airlinair', 'BIH': 'British International Helicopters', 'TZK': 'Tajik Air', 'EPA': 'Shenzhen Donghai Airlines', 'EAG': 'Eagle Airways', 'RYN': 'Ryan International Airlines', 'ACA': 'Air Canada', 'FFX': 'Flex Linhas Aéreas', 'MKA': 'MK Airlines', 'WAK': 'Wings of Alaska', 'JKK': 'Spanair', 'THT': 'Air Tahiti Nui', 'KRP': 'Carpatair', 'IYE': 'Yemenia - Yemen Airways', 'CIX': 'City Connexion Airlines', 'BSR': 'Guine Bissaur Airlines', 'HVY': 'Heavylift Cargo Airlines', 'SRQ': 'South East Asian Airlines', 'DLA': 'Air Dolomiti', 'ISS': 'Meridiana', 'AKK': 'Aklak Air', 'BKA': 'Bankair', 'TPA': 'Tampa Cargo', 'OAE': 'Omni Air International', 'CWM': 'Air Marshall Islands', 'SWT': 'Swiftair', 'PAC': 'Polar Air Cargo', 'AFL': 'Aeroflot Russian Airlines', 'PEN': 'PenAir (Peninsula Airways)', 'CPB': 'Corporate Express', 'GTI': 'Atlas Air', 'ELO': 'Eurolot', 'LOG': 'Loganair', 'VKG': 'Thomas Cook Airlines Scandinavia', 'CIM': 'Cimber Air', 'ATM': 'Airlines Of Tasmania', 'IRB': 'Iran Air Tours', 'FFM': 'Firefly', 'OLT': 'OLT - Ostfriesische Lufttransport', 'FLG': 'Pinnacle Airlines', 'EAK': 'Euro-Asia Air', 'EGJ': 'Scenic Airlines', 'KFR': 'Kingfisher Airlines', 'AWE': 'US Airways', 'GAI': 'Moskovia Airlines', 'TJT': 'Twin Jet', 'VLM': 'VLM Airlines', 'RKM': 'RAK Airways', 'IRM': 'Mahan Air', 'MXA': 'Mexicana', 'QNK': 'Kabo Air', 'RBA': 'Royal Brunei Airlines', 'LYC': 'Lynden Air Cargo', 'MWG': 'MASwings', 'PPW': 'Royal Phnom Penh Airways', 'JXX': 'Primera Air', 'SBU': 'Saint Barth Commuter', 'JSA': 'Jetstar Asia Airways', 'LAO': 'Lao Airlines', 'AAN': 'Amsterdam Airlines', 'JZA': 'Air Canada Jazz', 'SWA': 'Southwest Airlines', 'AUT': 'Austral Lineas Aereas', 'CTN': 'Croatia Airlines', 'LAB': 'L.A.B. Flying Service', 'TSG': 'Trans Air Congo', 'TVS': 'Smart Wings', 'MAU': 'Air Mauritius', 'DHK': 'DHL Air UK', 'TNA': 'TransAsia Airways', 'IAD': 'Fly Wex', 'SFJ': 'Star Flyer', 'AWU': 'Sylt Air', 'LUR': 'Atlantis European Airways', 'AEI': 'Air Italy Polska', 'NRR': 'Nature Air', 'GSS': 'Global Supply Systems', 'LMZ': 'Starline.kz', 'AFU': 'Afrinat International Airlines', 'EYE': 'FS Air Service', 'TRS': 'AirTran Airways', 'ONA': 'Yeongnam Air', 'AJV': 'ANA & JP Express', 'TCI': 'Air Turks and Caicos', 'SKU': 'Sky Airline', 'SWQ': 'Swift Air', 'BBC': 'Biman Bangladesh Airlines', 'AHW': 'Aeromist-Kharkiv', 'REU': 'Air Austral', 'RLK': 'Air Nelson', 'MAK': 'MAT Macedonian Airlines', 'SLI': 'Aeroméxico Connect', 'LCG': 'Lignes Aériennes Congolaises', 'TAE': 'TAME', 'LKN': 'Lankair', 'GZP': 'Gazpromavia', 'CLW': 'Centralwings', 'NYL': 'Mid Airlines', 'NVR': 'Novair', 'RUS': 'Cirrus Airlines', 'MES': 'Mesaba Airlines', 'CRD': 'Air Corridor', 'VSV': 'Scat Aircompany', 'LID': 'Alidaunia', 'HFY': 'Hi Fly', 'SWU': 'Swiss European Air Lines', 'PBN': 'Pacific Blue Airlines', 'AKL': 'Air Kiribati', 'GLR': 'Central Mountain Air', 'ACL': 'ItAli Airlines', 'BON': 'B&H Airlines', 'WSG': 'Wasaya Airways', 'JEC': 'Jett8 Airlines Cargo', 'LNE': 'LAN Ecuador', 'FWI': 'Air Caraibes', 'IRC': 'Iran Aseman Airlines', 'CVC': 'Centre-Avia', 'LAV': 'Aeropostal Alas de Venezuela', 'KPA': 'Kunpeng Airlines', 'AFN': 'Air Freight NZ', 'JZR': 'Jazeera Airways', 'KFS': 'Kalitta Charters', 'CAW': 'Comair', 'TUS': 'ABSA Cargo Airline', 'AXY': 'Axis Airways', 'AIP': 'Alpine Air Express', 'FXI': 'Air Iceland (Flugfélag Íslands)', 'TFL': 'Arkefly', 'COZ': 'Cosmic Air', 'MDG': 'Air Madagascar', 'IBX': 'Ibex Airlines', 'AUB': 'Augsburg Airways GmbH', 'PEC': 'Pacific East Asia Cargo Airlines', 'EDW': 'Edelweiss Air', 'SLA': 'Sierra National Airlines', 'WON': 'Wings Air', 'LTC': 'SmartLynx Airlines', 'SMX': 'Alitalia Express', 'BMJ': 'Bemidji Airlines', 'AAS': 'Askari Aviation', 'VNR': 'Wan Air', 'BHP': 'Belair Airlines', 'JUS': 'USA Jet Airlines', 'HVN': 'Vietnam Airlines', 'RZO': 'SATA International', 'ADH': 'Air One', 'EUP': 'EuroAir', 'BUC': 'Bulgarian Air Charter', 'CXH': 'China Xinhua Airlines', 'RSO': 'Aero Asia International', 'RNA': 'Nepal Airlines', 'AWI': 'Air Wisconsin', 'WOW': 'Air Southwest', 'TCW': 'Thomas Cook Airlines', 'PIR': 'Pamir Airways', 'HZT': 'Air Horizon', 'TCX': 'Thomas Cook Airlines', 'BTR': 'Botir-Avia', 'PTN': 'Pantanal Linhas Aereas Sul-Matogrossenses', 'SAA': 'South African Airways', 'EZY': 'easyJet', 'FRE': 'Freedom Air', 'TPU': 'TACA Peru', 'CRF': 'Air Central', 'SAM': 'SAM Colombia', 'WVL': 'Wizz Air', 'PHW': 'AVE.com', 'MGX': 'Montenegro Airlines', 'AGB': 'Air Service Gabon', 'OZW': 'Skywest Airlines', 'WIF': 'Wideroe', 'BPA': 'Blue Panorama Airlines', 'ANT': 'Air North', 'RPB': 'AeroRepublica', 'FSW': 'Faso Airways', 'AMX': 'AeroMéxico', 'AMC': 'Air Malta', 'KEE': 'Keystone Air Services', 'GIA': 'Garuda Indonesia', 'ENK': 'Enkor', 'SEJ': 'Spicejet', 'THA': 'Thai Airways International', 'REA': 'Aer Arann', 'BLF': 'Blue1', 'EGU': 'Eagle Air', 'SSX': 'Lynx Aviation', 'EXK': 'Executive Airlines', 'IWD': 'Iberworld', 'ELL': 'Estonian Air', 'NAS': 'Nasair', 'RGL': 'Regional Air Lines', 'HHA': 'Atlantic Airlines de Honduras', 'CJA': 'CanJet', 'JAI': 'Jet Airways', 'KZU': 'Kuzu Airlines Cargo', 'WTA': 'Africa West', 'ESK': 'SkyEurope', 'GFG': 'Georgian National Airlines', 'ISR': 'Israir Airlines', 'GDR': 'Gadair European Airlines', 'INC': 'Insel Air', 'KGA': 'Kyrgyzstan Airlines', 'NMI': 'Pacific Wings', 'COM': 'Comair', 'KDR': 'Royal Daisy Airlines', 'SGN': 'SGA Airlines', 'KZR': 'Air Astana', 'HAL': 'Hawaiian Airlines', 'KRE': 'AeroSucre', 'LAL': 'Air Labrador', 'PEL': 'Aeropelican Air Services', 'CSH': 'Shanghai Airlines', 'PLR': 'Northwestern Air', 'ABD': 'Air Atlanta Icelandic', 'CSQ': 'IBC Airways', 'SWN': 'West Air Sweden', 'BUG': 'Mokulele Airlines', 'BAW': 'British Airways', 'ERO': "Sun d'Or International Airlines", 'AEY': 'Air Italy', 'GAL': 'Galaxy Air', 'NTJ': 'Nextjet', 'DAE': 'DHL Aero Expreso', 'ASZ': 'Astrakhan Airlines', 'SAH': 'Sayakhat Airlines', 'MON': 'Monarch Airlines', 'AER': 'Alaska Central Express', 'ARG': 'Aerolineas Argentinas', 'SMJ': 'Avient Aviation', 'OZJ': 'Ozjet Airlines', 'OHY': 'Onur Air', 'LDE': 'LADE - Líneas Aéreas del Estado', 'ESF': 'Estafeta Carga Aerea', 'AAY': 'Allegiant Air', 'AUR': 'Aurigny Air Services', 'VIM': 'Air VIA', 'SOA': 'Southern Air Charter', 'SLK': 'SilkAir', 'AEA': 'Air Europa', 'EZE': 'Eastern Airways', 'BRU': 'Belavia Belarusian Airlines', 'TIB': 'TRIP Linhas Aereas', 'ATN': 'Air Transport International LLC', 'BWA': 'Caribbean Airlines', 'IMX': 'Zimex Aviation', 'TNM': 'Tiara Air', 'FWL': 'Florida West International Airways', 'CLH': 'Lufthansa CityLine', 'CAY': 'Cayman Airways', 'RUN': 'ACT Airlines', 'TPC': 'Air Caledonie', 'ANZ': 'Air New Zealand', 'KAC': 'Kuwait Airways', 'SEU': 'XL Airways France', 'JAB': 'Air Bagan', 'OAL': 'Olympic Airlines', 'ODS': 'Odessa Airlines', 'JBA': 'Helijet', 'NGE': 'Angel Airlines', 'SOL': 'Solomon Airlines', 'AZN': 'Amaszonas', 'KAE': 'Kartika Airlines', 'MMZ': 'euroAtlantic airways', 'MNA': 'Merpati Nusantara Airlines', 'BML': 'Bismillah Airlines', 'AEW': 'Aerosvit Airlines', 'SVR': 'Ural Airlines', 'AUI': 'Ukraine International Airlines', 'CCA': 'Air China', 'TAO': 'Aeromar', 'AHY': 'Azerbaijan Airlines', 'RNX': '1Time', 'MPH': 'Martinair', 'KMP': 'Kampuchea Airlines', 'BST': 'Bestair', 'MEA': 'Middle East Airlines', 'CHH': 'Hainan Airlines', 'BRV': 'Bravo Air Congo', 'ARR': 'Air Armenia', 'KGL': 'Kogalymavia', 'ICE': 'Icelandair', 'AIB': 'Airbus Industrie', 'FFT': 'Frontier Airlines', 'ADR': 'Adria Airways', 'DAO': 'Daallo Airlines', 'PUA': 'PLUNA', 'MJN': 'Royal Air Force of Oman', 'WDL': 'WDL Aviation', 'TRA': 'transavia.com', 'AEU': 'Astraeus', 'CGN': "Chang'an Airlines", 'KAP': 'Cape Air', 'MRW': 'Mars RK', 'GJS': 'GoJet Airlines', 'AZE': 'Arcus-Air Logistic', 'UCA': 'CommutAir', 'FRJ': 'Afrijet Airlines', 'RLE': 'Rico Linhas Aereas', 'MAI': 'Mauritania Airlines International', 'SOO': 'Southern Air', 'ABW': 'AirBridgeCargo Airlines', 'PGA': 'Portugalia', 'BKP': 'Bangkok Airways', 'EEU': 'Eurofly', 'WDA': 'Wimbi Dira Airways', 'YZR': 'Yangtze River Express', 'AHR': 'Air2there', 'RCH': 'Air Mobility Command', 'BER': 'Air Berlin', 'EIN': 'Aer Lingus', 'EAQ': 'Eastern Australia Airlines', 'HDA': 'Dragonair, Hong Kong Dragon Airlines', 'LAN': 'LAN Airlines', 'TDX': 'Tradewinds Airlines', 'GIF': 'Guinee Airlines', 'KIS': 'Contact Air', 'RON': 'Nauru Air Corporation', 'LBC': 'Albanian Airlines', 'TUX': 'TunisAir Express', 'GEC': 'Lufthansa Cargo', 'ITX': 'Imair Airlines', 'UIA': 'Uni Air', 'DNL': 'Dutch Antilles Express', 'TDM': 'Tandem Aero', 'NWR': 'Northwest Regional Airlines', 'NWA': 'Northwest Airlines', 'CYP': 'Cyprus Airways', 'CRN': 'Aero Caribbean', 'TNB': 'Trans Air Benin', 'AAF': 'Aigle Azur', 'FHE': 'Hello', 'FCR': 'Flying Carpet', 'UKM': 'UM Airlines', 'UAL': 'United Airlines', 'LIL': 'FlyLal (Lithuanian Airlines)', 'LAM': 'LAM Mozambique Airlines', 'LPE': 'LAN Peru', 'PBA': 'PB Air', 'ASJ': 'Air Satellite', 'VTS': 'Everts Air Cargo', 'BEE': 'Flybe', 'KLC': 'KLM Cityhopper', 'VDA': 'Volga-Dnepr Airlines', 'CUB': 'Cubana de Aviacion', 'KLB': 'Air Mali International', 'BCY': 'CityJet', 'BHS': 'Bahamasair', 'SHQ': 'Shanghai Airlines Cargo', 'LXP': 'LAN Express', 'ARD': 'Aerocondor', 'SXR': 'Sky Express', 'CGP': 'Cargo Plus Aviation', 'UTY': 'Alliance Airlines', 'GMI': 'Germania', 'KFA': 'Kelowna Flightcraft Air Charter', 'TOK': 'Airlines PNG', 'MDA': 'Mandarin Airlines', 'HHN': 'Hahn Air', 'IGO': 'IndiGo Airlines', 'SUD': 'Sudan Airways', 'ALX': 'Hewa Bora Airways', 'JEX': 'JAL Express', 'LGL': 'Luxair', 'GLA': 'Great Lakes Airlines', 'PSD': 'President Airlines', 'ADO': 'Hokkaido International Airlines', 'NMB': 'Air Namibia', 'RAM': 'Royal Air Maroc', 'SDA': 'Sol Dominicana Airlines', 'MBN': 'Zambian Airways', 'LZB': 'Bulgaria Air', 'BMI': 'bmibaby', 'SOV': 'Saravia', 'ARA': 'Arik Air', 'DQA': 'Maldivian', 'NKS': 'Spirit Airlines', 'AIA': 'Avies', 'CCM': 'CCM Airlines', 'TCF': 'Shuttle America', 'LTF': 'Lufttaxi Fluggesellschaft', 'CQH': 'Spring Airlines', 'EXS': 'Jet2.com', 'QXE': 'Horizon Air', 'TAP': 'TAP Portugal', 'LYN': 'Kyrgyzstan', 'AML': 'Air Malawi', 'VAS': 'ATRAN Cargo Airlines', 'WRF': 'Wright Air Service', 'LLR': 'Air India Regional', 'URG': 'Air Urga', 'VUN': 'Air Ivoire', 'QFA': 'Qantas', 'RXA': 'Regional Express Airlines', 'WBA': 'Finncomm Airlines', 'JAC': 'Japan Air Commuter', 'ASA': 'Alaska Airlines', 'GTV': 'Aerogaviota', 'JAT': 'Jat Airways', 'CMM': 'Compagnie Aérienne du Mali', 'SJY': 'Sriwijaya Air', 'LAP': 'TAM Airlines', 'MLA': '40-Mile Air', 'POT': 'Polet Airlines', 'DRK': 'Druk Air', 'EGF': 'American Eagle Airlines', 'CVU': 'Grand Canyon Airlines', 'GOM': 'Gomelavia', 'SPR': 'Provincial Airlines', 'PDF': 'Pelican Air Services', 'NOK': 'Nok Air', 'TSD': 'TAF Linhas Aéreas', 'JST': 'Jetstar Airways', 'PLM': 'Air Pullmantur', 'VPP': 'Vintage Props and Jets', 'MOV': 'VIM Airlines', 'ABY': 'Air Arabia', 'CIR': 'Arctic Circle Air Service', 'CXA': 'Xiamen Airlines', 'MSL': 'Marsland Aviation', 'WRC': 'Wind Rose Aviation', 'JJA': 'Jeju Air', 'GWL': 'Great Wall Airlines', 'CKS': 'Kalitta Air', 'JAV': 'Jordan Aviation', 'IRP': 'Payam Air', 'DNU': 'DOT LT', 'SWR': 'Swiss International Air Lines', 'AAH': 'Aloha Air Cargo', 'BWG': 'Blue Wings', 'SCW': 'Malmö Aviation', 'FIN': 'Finnair', 'ILN': 'Interair South Africa', 'AVA': 'Avianca - Aerovias Nacionales de Colombia, S.A.', 'DTH': 'Tassili Airlines', 'UZB': 'Uzbekistan Airways', 'RMV': 'Romavia', 'RIU': 'Riau Airlines', 'SBS': 'Seaborne Airlines', 'SFR': 'Safairx', 'TSE': 'Transmile Air Services', 'LBY': 'Belle Air', 'OEA': 'Orient Thai Airlines', 'JAE': 'Jade Cargo International', 'AGX': 'Aviogenex', 'CWC': 'Centurion Air Cargo', 'UDC': 'DonbassAero', 'IRA': 'Iran Air', 'SDR': 'City Airline', 'PMT': 'PMTair', 'NJS': 'National Jet Systems', 'EZA': 'Eznis Airways', 'EVA': 'EVA Air', 'NRD': 'Nordic Regional', 'TCV': 'TACV Cabo Verde Airlines', 'GUN': 'Grant Aviation', 'BRQ': 'Buraq Air', 'EEA': 'Empresa Ecuatoriana De Aviacion', 'KDC': 'KD Air', 'AAB': 'Abelag Aviation', 'NJE': 'NetJets Europe', 'ANK': 'Air Nippon', 'DXH': 'East Star Air', 'DKH': 'Juneyao Airlines', 'JBU': 'JetBlue Airways', 'ROT': 'Tarom', 'RHC': 'Redhill Aviation', 'RSR': 'Aero-Service', 'SVA': 'Saudi Arabian Airlines', 'RNV': 'Armavia', 'CMP': 'Copa Airlines', 'RLN': 'Aero Lanka', 'JFU': 'Jet4you', 'JAL': 'Japan Airlines', 'CHP': 'Aviacsa'}
#read the points by constraint, 
#if constraint = {}, return all the points
# class PointReadHandler(tornado.web.RequestHandler):
#     def post(self):
#         ''''
#             constraint: {
#             'databaseType': //database type
#             'dataSetName': //name of collection
#             }
#         '''
#         self.set_header('Access-Control-Allow-Origin', "*")
#         constraint = self.get_argument('constraint')
#         points = g_DataReader.queryPoints(constraint)   
#         self.write(result)

def filterTrajData(points):
    # arrTrajs = []
    # depTrajs = []
    trajData = []
    trajKey= {}
    
    for index in points:
        if index['trajID'] not in trajKey:
            trajKey[index['trajID']]=0

            temp={}
           

            if 'arrdir' in index:
            	temp['arr'] = index['arrdir']
            else:
            	temp['arr'] = -1

            if type(index['callsign'])==type('aa'):
                temp['callsign'] = index['callsign']
            else:
                temp['callsign'] = ''
            
                
            temp['trajID'] = index['trajID']
            temp['data'] = []
            
            for i in range(len(index['timestamp'])):
                if math.isnan(index['timestamp'][i]) or math.isnan(index['loc']['coordinates'][i][2]) or math.isnan(index['speed'][i]) or math.isnan(index['loc']['coordinates'][i][1]) or math.isnan(index['loc']['coordinates'][i][0]):
                    continue
                record={}
                record['Timestamp'] = index['timestamp'][i]
                #record['Altitude'] = index['loc']['coordinates'][i][2]
                #record['Speed'] = index['speed'][i]
                record['latlon'] = [index['loc']['coordinates'][i][1], index['loc']['coordinates'][i][0]]
                temp['data'].append(record)


            temp['sTime'] = index['stTime']
            temp['eTime'] = index['enTime']

            # if index['trajInf']==1:
            #      temp['origin'] = index['origin']
            #      temp['destination'] = index['destination']
            #      temp['time'] = index['time']

            try:
                temp['origin'] = index['origin']
                temp['destination'] = index['destination']
                temp['time'] = index['time']
            except:
                temp['origin'] = ''
                temp['destination'] = ''
                temp['time'] = ''

            trajData.append(temp)
        else:
            trajKey[index['trajID']]+=1

    return trajData

            # if index['arrdir'] == 1:
            #     temp={}
            #     temp['arr'] = 1;

            #     if type(index['callsign'])==type('aa'):
            #         temp['callsign'] = index['callsign']
            #     else:
            #         temp['callsign'] = ''
                
                    
            #     temp['trajID'] = index['trajID']
            #     temp['data'] = []
                
            #     for i in range(len(index['timestamp'])):
            #         if math.isnan(index['timestamp'][i]) or math.isnan(index['loc']['coordinates'][i][2]) or math.isnan(index['speed'][i]) or math.isnan(index['loc']['coordinates'][i][1]) or math.isnan(index['loc']['coordinates'][i][0]):
            #             continue
            #         record={}
            #         record['Timestamp'] = index['timestamp'][i]
            #         #record['Altitude'] = index['loc']['coordinates'][i][2]
            #         #record['Speed'] = index['speed'][i]
            #         record['latlon'] = [index['loc']['coordinates'][i][1], index['loc']['coordinates'][i][0]]
            #         temp['data'].append(record)


            #     temp['sTime'] = index['stTime']
            #     temp['eTime'] = index['enTime']
            #     if index['trajInf']==1:
            #          temp['origin'] = index['origin']
            #          temp['destination'] = index['destination']
            #          #temp['aircraft'] = index['aircraft']
            #          temp['time'] = index['time']
            #     arrTrajs.append(temp)

            # else:
            #     #print(index['trajID'])

            #     #print(index['trajID'])
            #     try:
            #         temp={}
            #         temp['arr'] = 0;
            #        # print('trajID')
                    
            #         if type(index['callsign'])==type('aa'):
            #             temp['callsign'] = index['callsign']
            #         else:
            #             # print(index['callsign'])
            #             # print(type(index['callsign']))
            #             temp['callsign'] = ''

            #         temp['trajID'] = index['trajID']
            #        # print(temp['trajID'])
            #         temp['data'] = []
                    
            #         for i in range(len(index['timestamp'])):
            #             if math.isnan(index['timestamp'][i]) or math.isnan(index['loc']['coordinates'][i][2]) or math.isnan(index['speed'][i]) or math.isnan(index['loc']['coordinates'][i][1]) or math.isnan(index['loc']['coordinates'][i][0]):
            #                 continue
            #             record={}
            #             record['Timestamp'] = index['timestamp'][i]
            #             #record['Altitude'] = index['loc']['coordinates'][i][2]
            #             #record['Speed'] = index['speed'][i]
            #             record['latlon'] = [index['loc']['coordinates'][i][1], index['loc']['coordinates'][i][0]]
            #             temp['data'].append(record)

            #         temp['sTime'] = index['stTime']
            #         temp['eTime'] = index['enTime']
            #         if index['trajInf']==1:
            #             temp['origin'] = index['origin']
            #             temp['destination'] = index['destination']
            #             #temp['aircraft'] = index['aircraft']
            #             temp['time'] = index['time']
            #         depTrajs.append(temp)
            #     except:
            #         print('traj find except')
        

    #print(arrTrajs[0])
    
class CurtimeReadHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)
        print(111,constraint)

        start = time.clock()
        queryData = g_DataReader.queryCurtime(constraint)
        
        points = queryData['trajData']

        CDMData = queryData['CDMData'] 
        
        x = float('nan')
        print('traNum:',len(points))
        #print('CDMNum:',len(CDMData))  

        data={}
        trajData = filterTrajData(points)
        # arrCDMs = []
        # depCDMs = []
        # CDMKey= []
        # for index in CDMData:
        #     if index['trajID'] not in CDMKey:
        #         del index['_id']
        #         ICAO = getICAO(index['航班号'])
        #         index['airlineCode'] = ICAO
        #         try:
        #             index['airline'] = airlineMap[getICAO(index['航班号'])]
        #         except:
        #             index['airline'] = ''

        #         CDMKey.append(index['trajID'])
        #         if index['arrdir'] ==1:
        #             arrCDMs.append(index)
        #         else:
        #             depCDMs.append(index)

        # CDMData = {'depCDMs': depCDMs, 'arrCDMs': arrCDMs}

        # pcData = filterData(CDMData)


        data={'trajData':trajData}
        data = json.dumps(data);


        print('buffer size',len(data)/(1024*1024),"M")


        end = time.clock()
        print('Filter curtime running time: %s Seconds'%(end-start))
        #start = time.clock()
        self.write({'data': data});
        #end = time.clock()
        #print('Running time: %s Seconds'%(end-start))

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)

def dealData(data, flag):
    temp = []
    for i in range(len(data)):
      if flag == 0:
        data[i]['计划降落'] = ''
        data[i]['实际降落'] = ''
      else:
        data[i]['开始登机'] = ''
        data[i]['关闭登机门'] = ''
        data[i]['P&S时间'] = ''
        data[i]['TAX时间'] = ''
        data[i]['DEP时间'] = ''

      record = {}
      record['callsign'] = data[i]['航班号']
      #record['trajID'] = data[i]['trajID']
      if 'trajID' in data[i].keys():
        record['trajID'] = data[i]['trajID']
      # else:
      #   record['trajID'] = str(uuid.uuid1())
      record['arr'] = flag

      if flag==1:
        #arrival
        record['Schedule Arrival'] = data[i]['计划降落'] if data[i]['计划降落'] else ''
        record['Actual Arrival'] = data[i]['实际降落'] if data[i]['实际降落'] else ''
        record['Arrival Delay Dur'] = (data[i]["实际降落"] - data[i]["计划降落"])/(60*1000) if data[i]["实际降落"] and data[i]["计划降落"] else ''
        record['Flight Delay Dur'] = ((data[i]["实际降落"] - data[i]["实际起飞"])/(60*1000)-(data[i]["计划降落"] - data[i]["计划起飞"])/(60*1000)) if data[i]["实际降落"] and data[i]["实际起飞"] and data[i]["计划降落"] and data[i]["计划起飞"] else ''
        #public
        #record['机型'] = data[i]["机型"] if data[i]["机型"] else ''
        record['Schedule Departure'] = data[i]["计划起飞"] if data[i]["计划起飞"] else ''
        record["Actual Departure"] = data[i]["实际起飞"] if data[i]["实际起飞"] else '' 
        record["Departure Delay Dur"] = (data[i]["实际起飞"]-data[i]["计划起飞"])/(60*1000) if data[i]["实际起飞"] and data[i]["计划起飞"] else ''
        # srecord['Runway'] = data[i]["跑道"] if data[i]["跑道"] else ''
      else:
        #departure
        record['Boarding Dur'] = (data[i]["关闭登机门"] - data[i]["开始登机"])/(60*1000) if data[i]["关闭登机门"] and data[i]["开始登机"] else ''
        record['Preparing Dur'] = (data[i]["P&S时间"] - data[i]["关闭登机门"])/(60*1000) if data[i]["P&S时间"] and data[i]["关闭登机门"] else ''
        record['Service Dur'] = (data[i]["TAX时间"] - data[i]["P&S时间"])/(60*1000) if data[i]["TAX时间"] and data[i]["P&S时间"] else ''
        record['Taxing Dur'] = (data[i]["DEP时间"] - data[i]["TAX时间"])/(60*1000) if data[i]["DEP时间"] and data[i]["TAX时间"] else ''
        #record['Runway Flow'] = data[i]["跑道流量"] if data[i]["跑道流量"] else ''
        #record['Reason'] = data[i]["最终判断原因"] if data[i]["最终判断原因"] else ''
        #public
        #record['机型'] = data[i]["机型"] if data[i]["机型"] else ''
        record['Schedule Departure'] = data[i]["计划起飞"] if data[i]["计划起飞"] else ''
        record["Actual Departure"] = data[i]["DEP时间"] if data[i]["DEP时间"] else ''
        record["Departure Delay Dur"] = (data[i]["DEP时间"]-data[i]["计划起飞"])/(60*1000) if data[i]["DEP时间"] and data[i]["计划起飞"] else ''
        #record['Runway'] = data[i]["跑道"] if data[i]["跑道"] else ''
     
      # if flag==0:
      #   record["实际起飞时间"] = data[i]["DEP时间"] if data[i]["DEP时间"] else ''
      #   record["起飞延误时长/min"] = (data[i]["DEP时间"]-data[i]["计划起飞"])/(60*1000) if data[i]["DEP时间"] and data[i]["计划起飞"] else ''
      # else:
      #   record["实际起飞时间"] = data[i]["实际起飞"] if data[i]["实际起飞"] else ''
      #   record["起飞延误时长/min"] = (data[i]["实际起飞"]-data[i]["计划起飞"])/(60*1000) if data[i]["实际起飞"] and data[i]["计划起飞"] else ''

      
      temp.append(record)
    data = temp
    return data


def getICAO(callsign):
    callsign = str(callsign)
    for i in range(0,len(callsign)):
        if callsign[i]<='9':
            break
    ICAO = callsign[:i]
    return ICAO
def filterData(data):
    features = [{'feaName':'Schedule Arrival','arr':1,'type':'time'},
    {'feaName':'Actual Arrival','arr':1,'type':'time'},
    {'feaName':'Arrival Delay Dur','arr':1,'type':'number'},
    {'feaName':'Flight Delay Dur','arr':1,'type':'number'},

    {'feaName':'Schedule Departure','arr':2,'type':'time'},
    {'feaName':'Actual Departure','arr':2,'type':'time'},
    {'feaName':'Departure Delay Dur','arr':2,'type':'number'},
   # {'feaName':'Runway','arr':2,'type':'time'},
    {'feaName':'Boarding Dur','arr':0,'type':'number'},
    {'feaName':'Preparing Dur','arr':0,'type':'number'},
    {'feaName':'Service Dur','arr':0,'type':'number'},
    {'feaName':'Taxing Dur','arr':0,'type':'number'},
    #{'feaName':'Runway Flow','arr':0,'type':'number'}
    #{'feaName':'Reason','arr':0,'type':'number'},
    ]


    #ordinal

    arrFeaList = []
    depFeaList = []
    pubFeaList = []
    feaList = []
    feaRange = {}
    feaDict = {}

    for index in features:
        if index['arr'] == 1:
            arrFeaList.append(index['feaName'])
        elif index['arr'] == 0:
            depFeaList.append(index['feaName'])
        else:
            pubFeaList.append(index['feaName'])
        feaList.append(index['feaName'])    
        feaDict[index['feaName']] = index
    
    arrData = data['arrCDMs'];
    depData = data['depCDMs'];
    
    # print('arrData',arrData)
    depData = dealData(depData, 0)
    arrData = dealData(arrData, 1)
    
    

    data = arrData + depData

    for d in feaList:
        valueMin = 0
        valueMax = 1
        if feaDict[d]['arr']==1:
            if arrData:
                temp = []
                for index in arrData:
                    if index[d]:
                        temp.append(index[d])
                valueMax = max(temp)
                valueMin = min(temp)
        elif feaDict[d]['arr']==0:
            if depData:
                # valueMax = max(index[d] if index[d] for index in depData)
                # valueMin = min(index[d] if index[d] for index in depData)
                temp = []
                for index in depData:
                    if index[d]:
                        temp.append(index[d])
                valueMax = max(temp)
                valueMin = min(temp)
        else:
            if data:
                try:
                    temp = []
                    for index in data:
                        if index[d]:
                            temp.append(index[d])
                    valueMax = max(temp)
                    valueMin = min(temp)

                    # valueMax = max(index[d] if index[d] for index in data)
                    # valueMin = min(index[d] if index[d] for index in data)
                except:
                    print(index)
        valueInterval = math.ceil((valueMax - valueMin)/14)*1.2
        #valueMin = valueMin - valueInterval
        feaRange[d] = [int(valueMin), int(math.ceil(valueMax)), valueInterval]
        

    for d in feaList:
        print(d)
        valueMin = 0
        valueMax = 1
        if feaDict[d]['arr']==1:
            if arrData:
                temp = []
                for index in arrData:
                    if not index[d]:
                        index[d] = feaRange[d][0]
        elif feaDict[d]['arr']==0:
            if depData:
                temp = []
                for index in depData:
                    if not index[d]:
                        index[d] = feaRange[d][0]
        else:
            if data:
                try:
                    temp = []
                    for index in data:
                        if not index[d]:
                            index[d] = feaRange[d][0]
                except:
                    print(index)   

    for index in arrFeaList:
        for i in range(len(arrData)):
            if not arrData[i][index]:
                arrData[i][index] = feaRange[index][0]

    for index in depFeaList:
        for i in range(len(depData)):
            if not depData[i][index]:
                depData[i][index] = feaRange[index][0]

    feaSta = {'Arr':{},'Dep':{},'Arr/Dep':{}}
    lineData = {'Arr':{},'Dep':{},'Arr/Dep':{}}

    # print(arrData)

    for d in feaList:
        #统计的间隔为15份
        valueRange = feaRange[d]
        valueMin = valueRange[0]
        valueMax = valueRange[1]
        valueInterval = valueRange[2]
        # valueMin -= valueInterval
        #第一个刻度存放值不存在的情况
        
        aaa=0

        if feaDict[d]['arr']==1 and arrData:
            feaSta['Arr'][d]=[]
            for i in range(15):
                value = valueMin+valueInterval*i
                num=0
                try:
                    for re in arrData:
                        if re[d]>=value and re[d]<value+valueInterval:
                            num+=1
                except:
                    pass
                feaSta['Arr'][d].append({'value':value, 'arrNum':num, 'depNum':0, 'arrNumRemove':0, 'depNumRemove':0, 'num':num})


            # lineData['Arr'][d]=[]
            # for i in range(len(arrData)):
            #     num=1
            #     for j in range(i+1,len(arrData),1):
            #         if arrData[i][d] == arrData[j][d]:
            #             num+=1
            #     lineData['Arr'][d].append({'value': arrData[i][d], 'num':num})

            # lineData['Arr'][d] = sorted(lineData['Arr'][d], key=itemgetter('value'))

        # print('aaaNum',len(arrData)+len(depData))
        # print('aaa',aaa)

        if feaDict[d]['arr']==0 and depData:
            feaSta['Dep'][d]=[]
            for i in range(15):
                value = valueMin+valueInterval*i
                num=0
                try:
                    for re in depData:
                        if re[d]>=value and re[d]<value+valueInterval:
                            num+=1
                except:
                    pass
                feaSta['Dep'][d].append({'value':value, 'arrNum':0, 'depNum':num, 'arrNumRemove':0, 'depNumRemove':0, 'num':num})

            # lineData['Dep'][d]=[]
            # for i in range(len(depData)):
            #     num=1
            #     for j in range(i+1,len(depData),1):
            #         if depData[i][d] == depData[j][d]:
            #             num+=1
            #     lineData['Dep'][d].append({'value': depData[i][d], 'num':num})

            # lineData['Dep'][d] = sorted(lineData['Dep'][d], key=itemgetter('value'))

        if feaDict[d]['arr']==2 and data:
            feaSta['Arr/Dep'][d]=[]
            for i in range(15):
                value = valueMin+valueInterval*i
                num=0
                arrNum=0
                depNum=0
                try:
                    for re in data:
                        if re[d]>=value and re[d]<value+valueInterval:
                            num+=1
                            if re['arr'] ==1:
                                arrNum+=1
                            else:
                                depNum+=1
                except:
                    pass
                feaSta['Arr/Dep'][d].append({'value':value, 'arrNum':arrNum, 'depNum':depNum, 'arrNumRemove':0, 'depNumRemove':0, 'num':num}) 



            # lineData['Arr/Dep'][d]=[]
            # for i in range(len(data)):
            #     num=1
            #     for j in range(i+1,len(data),1):
            #         if data[i][d] == data[j][d]:
            #             num+=1
            #     lineData['Arr/Dep'][d].append({'value': data[i][d], 'num':num})

            # lineData['Arr/Dep'][d] = sorted(lineData['Arr/Dep'][d], key=itemgetter('value'))

    
    # for feaName in feaSta.keys():
    #     for fea in feaSta[feaName].keys():
    #         feaSta[feaName][fea]['num']=feaSta[feaName][fea]['arrNum']+feaSta[feaName][fea]['depNum']

    #print('data',data)
    #feaSta = {'Arr':{},'Dep':{},'Arr/Dep':{}}
    print('dataLen',len(data))
    return {"data":data,'features':features, 'feaSta':feaSta, 'lineData':lineData,'feaRange':feaRange}

class MonthStaReadHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)

        points = g_DataReader.queryMonthSta(constraint)   
        
        data={}

        #print(points[0])
        del points[0]['_id']
        
        print(points[0].keys())
        for index in points[0].keys():
            data[index] = points[0][index]
       
        data = json.dumps(data)

        self.write({
            'data': data,
        })

class DayStaReadHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        # self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        # self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)

        start = time.clock()

        points = g_DataReader.queryDaySta(constraint) 

        end = time.clock()
        print('Filter daysta running time: %s Seconds'%(end-start))

        data={}
        #print(points)
        del points[0]['_id']
        print(points[0].keys())
        data = points[0]
        # for index in points[0].keys():
        # 	temp = []
        # 	for re in points[0][index]:
        # 		temp=temp+re
        # 	data[index] = temp

        data = json.dumps(data)

        self.write({
            'data': data,
        })

class CDMReadHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)

        CDMData = g_DataReader.queryCDM(constraint) 

        print('CDMData',len(CDMData))

        CDMKey = []
        arrCDMs = []
        depCDMs = []
        for index in CDMData:
            if index['trajID'] not in CDMKey:
                del index['_id']
                ICAO = getICAO(index['航班号'])
                try:
                    index['airline'] = airlineMap[getICAO(index['航班号'])]
                except:
                    index['airlineCode'] = ''

                CDMKey.append(index['trajID'])
                if index['arrdir'] ==1:
                    arrCDMs.append(index)
                else:
                    depCDMs.append(index)

        
        
        CDMData = {'depCDMs': depCDMs, 'arrCDMs': arrCDMs}
        pcData = filterData(CDMData)
        #data = {'CDMData':CDMData}
        data = {'CDMData':CDMData, 'pcData':pcData}
        data = json.dumps(data)
        self.write({
            'data': data,
        })



    
class FliterCircleReadHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)
        start = time.clock()
        allData = g_DataReader.queryFilterCircle(constraint) 
        points = allData['trajList']
        data=[]

        for index in points:
            del index['_id']
            data.append(index['trajID'])
       # data = filterTrajData(points)
        CDMData = allData['CDMData']
        arrCDMs = []
        depCDMs = []
        CDMKey= []

        for index in CDMData:
            if index['trajID'] not in CDMKey:
                del index['_id']
                ICAO = getICAO(index['航班号'])
                index['airlineCode'] = ICAO
                try:
                    index['airline'] = airlineMap[getICAO(index['航班号'])]
                except:
                    index['airline'] = ''

                CDMKey.append(index['trajID'])
                if index['arrdir'] ==1:
                    arrCDMs.append(index)
                else:
                    depCDMs.append(index)

        CDMData = {'depCDMs': depCDMs, 'arrCDMs': arrCDMs}

        pcData = filterData(CDMData)

        data = {'trajList':data,'CDMData':CDMData, 'pcData':pcData}
        data = json.dumps(data)

        end = time.clock()
        print('Filter circle running time: %s Seconds'%(end-start))

        self.write({
            'data': data,
        })


class ProjectionAlgorithmHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)

        #print(constraint)

        arr_X = np.array(constraint['arr_data'])
        dep_X = np.array(constraint['dep_data'])

        pca = PCA(n_components=2)

        arr_newData = []
        dep_newData = []

        if len(arr_X):
            arr_newData = pca.fit_transform(arr_X).tolist()
        if len(dep_X):
            dep_newData = pca.fit_transform(dep_X).tolist()
        # arr_newData = pca.fit_transform(arr_X).tolist()
        # dep_newData = pca.fit_transform(dep_X).tolist()

        # print(arr_newData)
        # print(dep_newData)

        # newData = []

        # if len(arr_X):
        #     for row in arr_newData:
        #         newData.append(row.tolist())

        # if len(dep_X):
        #     for row in dep_newData:
        #         newData.append(row.tolist())

        # print(newData)

        # newData = newData.tolist()

        data = {'arr_data':arr_newData, 'dep_data':dep_newData}
        data = json.dumps(data)
        #print(data) 
        self.write({
            'data': data,
        })

class AirportReadHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 

        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)

        points = g_DataReader.queryAirport(constraint) 

        #print("points:", points)
        airport = []
        for index in points:
            del index['_id']
            temp={}
            loc = index['loc']
            del index['loc']
            temp['country'] = loc['country']
            temp['latitude'] = loc['coordinates'][1]
            temp['longitude'] = loc['coordinates'][0]
            index['position'] = temp
            airport.append(index) 
        # del points['_id']
        # data = points['data']
        airport = json.dumps(airport)

        self.write({
            'data': airport,
        })

class LoginReadHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 

        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)
       
        username=constraint['username'] 
        password=constraint['password']

        # print(username)
        # print(password)
        inf="error"
        if username=="boeing" and password=="pkuvisboeing":
            inf='success'
        
        inf = json.dumps(inf)
        self.write({
            'data': inf,
        })

class FixpotReadHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 

        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)


        points = g_DataReader.queryFixpot(constraint) 

        #print("points:", points)
        # airport = []
        # for index in points:
        #     del index['_id']
        #     temp={}
        #     loc = index['loc']
        #     del index['loc']
        #     temp['country'] = loc['country']
        #     temp['latitude'] = loc['coordinates'][1]
        #     temp['longitude'] = loc['coordinates'][0]

        #     index['position'] = temp
        #     airport.append(index) 
        # del points['_id']
        # data = points['data']

        fixPot=[]
        for i in range(len(points)):
            del points[i]['_id']
            fixPot.append(points[i])

        fixPot = json.dumps(fixPot)

        self.write({
            'data': fixPot,
        })


class CallsignReadHandler(tornado.web.RequestHandler):
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
        constraint = self.get_argument('constraint')
        constraint=json.loads(constraint)

        CDMData = g_DataReader.queryCallsign(constraint) 


        CDMKey = []
        arrCDMs = []
        depCDMs = []
        for index in CDMData:
            if index['trajID'] not in CDMKey:
                del index['_id']
                ICAO = getICAO(index['航班号'])
                index['airlineCode'] = ICAO
                try:
                    index['airline'] = airlineMap[getICAO(index['航班号'])]
                except:
                    index['airline'] = ''

                CDMKey.append(index['trajID'])
                if index['arrdir'] ==1:
                    arrCDMs.append(index)
                else:
                    depCDMs.append(index)


        # for index in CDMData:
        #     #if index['trajID'] not in CDMKey:
        #     del index['_id']
        #         #CDMKey.append(index['trajID'])
        #     #index['trajID'] = str(uuid.uuid1())
        #     if index['arrdir'] ==1:

        #         arrCDMs.append(index)
        #     else:
        #         depCDMs.append(index)

        CDMData = {'depCDMs': depCDMs, 'arrCDMs': arrCDMs}

        pcData = filterData(CDMData)

        data = {'CDMData':CDMData, 'pcData':pcData}
        data = json.dumps(data)

        end = time.clock()
       # print('Filter circle running time: %s Seconds'%(end-start))

        self.write({
            'data': data,
        })

        # data=[]
        # for index in points:
        #     del index['_id']
        #     data.append(index)
    
        # print("callsign num", len(data))
        # data = json.dumps(data)



        # self.write({
        #     'data': data,
        # })

class TrajIDReadHandler(tornado.web.RequestHandler):
    #query trajID
    def post(self):
        ''''
            constraint: {
            'databaseType': //database type
            'dataSetName': //name of collection
            }
        '''
        self.set_header('Access-Control-Allow-Origin', "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
        self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
        constraint = self.get_argument('constraint')
        #print('**************************')
        #print(constraint)
        constraint=json.loads(constraint)
        #print('**************************')
        points = g_DataReader.queryTrajID(constraint)   
        # traj = {}
        # for i in range(len(points)):
        #     del points[i]['_id']
        #     traj[str(i)]=points[i]
        del points['_id']
        traj = json.dumps(points)
        
        print('traj')

        self.write({
            'sus': "yes",
            'data': traj,
        })


# class PointMetaReadHandler(tornado.web.RequestHandler):
#  	def get(self):
#  		self.write('ok');


# class PointWriteHandler(tornado.web.RequestHandler):

#  	def post(self):
#  		datasetname = self.get_argument('DataSetName');
#  		datasetname = datasetname.strip();

#  		lidir = self.get_argument('liDir').split(',')
#  		lidir_new = []
#  		for tempdir in lidir:
#  			lidir_new.append(tempdir.strip())
#  		lidir = lidir_new;

#  		datadescript = self.get_argument('DataDescript')

#  		posnamelist = self.get_argument('PosNameList').split(',')
#  		liposname_new = []
#  		for posname in posnamelist:
#  			liposname_new.append(posname.strip())
#  		posnamelist = liposname_new;

#  		timename = self.get_argument('TimeName').strip();

#  		liattr = self.get_argument('liAtrrName').split(',');
#  		liattr_new = []
#  		for att in liattr:
#  			liattr_new.append(att.strip())
#  		liattr = liattr_new;

#  		pointmeta = {}
#  		pointmeta['m_DataSetName'] = datasetname;
#  		pointmeta['m_DataDescript'] = datadescript;
#  		pointmeta['m_PosName'] = posnamelist;
#  		pointmeta['m_TimeName'] = timename;
#  		pointmeta['m_liAtrrName'] = liattr;
#  		print(' point meta ', pointmeta);

#  		# pointmeta = json.loads(pointmeta_str);
#  		# print('[PointWriteHandler] 2 ', pointmeta, type(pointmeta));
#  		# print("[PointWriteHandler] read point file", pointmeta['m_DataSetName']);
#  		# print("[PointWriteHandler] read m_DataDescript", pointmeta.m_DataDescript);
#  		# print("[PointWriteHandler] read m_PosName", pointmeta.m_PosName);
#  		# print("[PointWriteHandler] read m_TimeName", pointmeta.m_TimeName);
#  		# print("[PointWriteHandler] read m_liAtrrName", pointmeta.m_liAtrrName);
 		
#  		result = g_PointWriter.writePoints(pointmeta, lidir);
#  		# self.write(result);
#  		self.write('ok');
#  		# self.write('ok');
