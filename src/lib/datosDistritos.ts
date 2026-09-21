// Ficha de los doce distritos.
// Los datos vienen tal cual del archivo services/distritos.js del
// sitio anterior: población, código postal, territorio, reseña en los
// dos idiomas y el video. Lo único que se agregó es la ilustración,
// que antes estaba repetida a mano en dos componentes distintos.
// `poblacion: -1` significa "no hay dato" (La Amistad), igual que
// antes; la ficha simplemente no muestra esa línea.

export interface FichaDistrito {
  nombre: string;
  // Segmento en /distritos/:id
  id: string;
  imagen: string;
  poblacion: number;
  codigoPostal: number;
  territorio: number;
  coordenadas: string;
  descripcionES: string;
  descripcionEN: string;
  urlVideo: string;
}

export const FICHAS_DISTRITO: FichaDistrito[] = [
    {
        nombre: "San Isidro de El General",
        id: "sanisidro",
        imagen: "/img/distritos/Distrito-01.png",
        poblacion: 45327,
        codigoPostal: 11901,
        territorio: 191.53,
        coordenadas: `09°22′32″N 83°42′19″O`,
        descripcionES: `El caserío que existía en esta zona se conocía con el nombre de Quebrada de Los Chanchos. En 1910 y gracias a Patrocinio Barrantes pasó a llamarse San Isidro de El General. La red eléctrica y el servicio de acueducto iniciaron sus operaciones en 1943. En 1948 la Junta de Gobierno gestionó una red telefónica para comunicar El General, Daniel Flores y Rivas, con el distrito central (San Isidro). El mercado municipal se inauguró en 1952 con la aprobación de un préstamo proveniente del Banco Nacional. En la edificación actualmente se ubica el Complejo Cultural. El 7 de agosto de 1954 Ureña —durante la administración de Figueres Ferrer— cambió oficialmente el nombre del pueblo a primero denominarse ciudad y de llamarse San Isidro por «San Isidro de El General», vía decreto n.º 40. En 1972 el servicio eléctrico municipal se traspasó al ICE.`,
        descripcionEN: `The hamlet that existed in this area was known as Quebrada de Los Chanchos. In 1910 and thanks to Patrocinio Barrantes it was renamed San Isidro de El General. The electrical network and the aqueduct service began operations in 1943. In 1948 the Government Board managed a telephone network to communicate El General, Daniel Flores and Rivas, with the central district (San Isidro). The municipal market was inaugurated in 1952 with the approval of a loan from the National Bank. The building currently houses the Cultural Center. On August 7, 1954 Ureña -during the Figueres Ferrer administration- officially changed the name of the town from San Isidro to "San Isidro de El General", via decree No. 40. In 1972 the municipal electric service was transferred to ICE.`,
        urlVideo: 'https://youtu.be/A-CyxA7lkQo',
    },
    {
        nombre: "El General",
        id: "general",
        imagen: "/img/distritos/Distrito-04.png",
        poblacion: 6373,
        codigoPostal: 11902,
        territorio: 76.35,
        coordenadas: `9°21′10″N 83°36′15″O`,
        descripcionES: `El distrito El General es el número dos de Pérez Zeledón el cual cuenta con una capital la cual es General Viejo, siendo uno de los primeros distritos en conformar el cantón, además de ser conocida como la cuna de Pérez Zeledón, aunque después de que San Isidro pasó a ser la cabecera del cantón, se ha invertido más que en El General dejándolo como un lugar solo para ganadería y agricultura. Tiene una extensión territorial de 76,35 kilómetros cuadrados y es de los menos habitados del cantón. La economía mayormente cuenta con agricultura de caña de azúcar y café, también con ganadería, por su tierras fértiles y grandes espacios que son aprovechados para estos fines, no obstante, se han encontrado también inicios de emprendimientos turísticos ya que cuenta con muchos atractivos naturales los cuales pueden ser aprovechados.`,
        descripcionEN: `The district El General is the number two of Pérez Zeledón which has a capital that is General Viejo, being one of the first districts to form the place. Besides being known as the cradle of Pérez Zeledón, although after San Isidro became the head of the area, it has been invested more than in El General leaving it as a place only for cattle raising and agriculture. It has a territorial extension of 76.35 square kilometers and is one of the least inhabited of Perez. The economy is mainly based on sugar cane and coffee agriculture, as well as cattle raising, due to its fertile land and large spaces that are used for these purposes, however, there have also been beginnings of tourism ventures since it has many natural attractions which can be exploited.`,
        urlVideo: 'https://youtu.be/-54suQj2LUM',
    },
    {
        nombre: "Daniel Flores",
        id: "danielflores",
        imagen: "/img/distritos/Distrito-03.png",
        poblacion: 33537,
        codigoPostal: 11903,
        territorio: 64.30,
        coordenadas: `9°18′28″N 83°39′33″O`,
        descripcionES: `Este distrito es el número tres del Cantón de Pérez Zeledón, este cantón se encuentra en la región Brunca, provincia de San José, este cuenta con una extensión territorial 64.3 kilómetro cuadrados y una población de 33.537 habitantes. Este distrito comprende los barrios de Alto Brisas, Ángeles, Aurora, Chiles, Crematorio, Daniel Flores, Laboratorio, Los Pinos, Loma Verde, Lourdes, Rosas, Rosa Iris, San Francisco, Santa Margarita, Trocha, Villa Ligia, Los poblados de Aguas Buenas (parte), Bajos de Pacuar, Concepción (parte), Corazón de Jesús, Juntas de Pacuar, Paso Bote, Patio de Agua, Peje, Percal, Pinar del Río, Quebrada Honda (parte), Repunta, Reyes, Ribera, Suiza.`,
        descripcionEN: `This district is number three of Pérez Zeledón, this place is located in the Brunca region, province of San Jose, it has a territorial extension of 64.3 square kilometers and a population of 33,537 inhabitants. This district includes the neighborhoods of Alto Brisas, Ángeles, Aurora, Chiles, Crematorio, Daniel Flores, Laboratorio, Los Pinos, Loma Verde, Lourdes, Rosas, Rosa Iris, San Francisco, Santa Margarita, Trocha, Villa Ligia, the towns of Aguas Buenas (part), Bajos de Pacuar, Concepción (part), Corazón de Jesús, Juntas de Pacuar, Paso Bote, Patio de Agua, Peje, Percal, Pinar del Río, Quebrada Honda (part), Repunta, Reyes, Ribera, Suiza.`,
        urlVideo: 'https://youtu.be/gwo8vudU6VA',
        },
    {
        nombre: "Rivas",
        id: "rivas",
        imagen: "/img/distritos/Distrito-02.png",
        poblacion: 6591,
        codigoPostal: 11904,
        territorio: 310.28,
        coordenadas: `9°29′07″N 83°35′39″O`,
        descripcionES: `El distrito de Rivas se encuentra ubicado en el cantón de Pérez Zeledón, San José Costa Rica aproximadamente a 10 kilómetros del parque central, en las faldas del Parque Nacional Chirripó. Su economía se centra en las actividades agropecuarias, al café, la ganadería de leche, confección de quesos y desarrollo de pequeños emprendimientos en el sector turístico; tales como cabañas con un concepto muy familiar, centros turísticos y restaurantes de estilo rústico, pesca de trucha y tilapia, entre otros. Lo que llega a identificar la cotidianidad de los locales.`,
        descripcionEN: `The district of Rivas is located in Pérez Zeledón, San Jose Costa Rica approximately 10 kilometers from the central park, in the foothills of Chirripo National Park. Its economy is centered on agricultural activities, coffee, dairy farming, cheese making and development of small businesses in the tourism sector, such as cabins with a very familiar concept, resorts and rustic style restaurants, trout and tilapia fishing, among others. All of which identify the daily life of the locals.`,
        urlVideo: 'https://youtu.be/u5jAetVOqIk', 
    },
    {
        nombre: "San Pedro",
        id: "sanpedro",
        imagen: "/img/distritos/Distrito-08.png",
        poblacion: 9102,
        codigoPostal: 11905,
        territorio: 205.96,
        coordenadas: `9°19′38″N 83°30′03″O`,
        descripcionES: `Limita con Buenos Aires de Puntarenas y el cantón de Talamanca. Al oeste limita con el distrito de Cajón y al sur con el distrito de Pejibaye. Es un distrito que tiene mucho potencial para el desarrollo del turismo. Posee todas las características necesarias para poder desarrollar una actividad turística, principalmente turismo rural y de aventura. El distrito de San Pedro es el distrito número cinco y es el tercero en extensión territorial con 205.96 kilómetros cuadrados, según el Inder, 2016. Cuenta con veintiún comunidades en total donde la cabecera del distrito es la comunidad de San Pedro. En 1920 San Pedro comienza a ser habitada por colonos del Valle Central y otras procedencias, anterior a esta fecha estaba habitado por comunidades indígenas de estribaciones talamanqueñas. En la actualidad, al localizarse en las faldas del Parque Nacional Chirripó, lo convierte en un atractivo el cual posee una gran riqueza hídrica que se hace evidente en su variedad de ríos, cascadas y pozas, además de que cuenta con variedad de cerros y de montañas ideales para el senderismo.`,
        descripcionEN: `It borders with Buenos Aires de Puntarenas and the canton of Talamanca. To the west it limits with the district of Cajón and to the south with the district of Pejibaye. It is a district that has great potential for tourism development. It has all the necessary characteristics to be able to develop tourist activities, mainly rural and adventure tourism. The district of San Pedro is district number five and is the third in territorial extension with 205.96 square kilometers, according to Inder, 2016. It has twenty-one communities in total where the head of the district is the community of San Pedro. In 1920 San Pedro begins to be inhabited by settlers from the Central Valley and other origins, prior to this date it was inhabited by indigenous communities of talamanqueñas foothills. At present, its location in the foothills of the Chirripó National Park, makes it an attractive place which has a great water wealth that is evident in its variety of rivers, waterfalls and pools, in addition to having a variety of hills and mountains ideal for hiking.`,
        urlVideo: 'https://youtu.be/hGiu1L1-O40',
    },
    {
        nombre: "Platanares",
        id: "platanares",
        imagen: "/img/distritos/Distrito-06.png",
        poblacion: 7203,
        codigoPostal: 11906,
        territorio: 79.84,
        coordenadas: `9°11′38″N 83°38′55″O`,
        descripcionES: `Platanares es el distrito número seis del cantón de Pérez Zeledón, ubicado a unos 25 km al sur de San Isidro de El General cuenta con una altitud de 645 y 865 msnm, posee una superficie de 90,13km² el cual se encuentra dividido en un total de 22 poblados aproximadamente siendo San Rafael la cabecera del distrito y el pueblo más desarrollado teniendo Platanares en su totalidad, una población de 7 203 habitantes según datos del INEC 2011.`,
        descripcionEN: `Platanares is the sixth district of the canton of Pérez Zeledón, located about 25 km south of San Isidro de El General has an altitude of 645 and 865 meters above sea level, has an area of 90.13km² which is divided into a total of 22 villages approximately being San Rafael main one of the district and the most developed town having Platanares in its entirety, a population of 7203 inhabitants according to INEC 2011.`,
        urlVideo: 'https://youtu.be/QV6XKiysgqc',
    },
    {
        nombre: "Pejibaye",
        id: "pejibaye",
        imagen: "/img/distritos/Distrito-07.png",
        poblacion: 7995,
        codigoPostal: 11907,
        territorio: 140.78,
        coordenadas: `9°08′58″N 83°33′37″O`,
        descripcionES: `El distrito de Pejibaye está ubicado en la Región Brunca, pertenece a la provincia de San José, al cantón de Pérez Zeledón y el cual divide su territorio en un total de 12 distritos. Pejibaye posee una extensión territorial de 206,10 kilómetros cuadrados y este es uno de los distritos con mayor extensión geográfica. Es importante recalcar que Pejibaye es considerado como una zona mayormente rural.`,
        descripcionEN: `The district of Pejibaye is located in the Brunca Region, it belongs to the province of San José, to the canton of Pérez Zeledón and which divides its territory in a total of 12 districts. Pejibaye has a territorial extension of 206.10 square kilometers and this is one of the districts with the largest geographical extension. It is important to emphasize that Pejibaye is considered a mostly rural area.`,
        urlVideo: 'https://youtu.be/UVyiRgLLdhU',
    },
    {
        nombre: "Cajón",
        id: "cajon",
        imagen: "/img/distritos/Distrito-05.png",
        poblacion: 8542,
        codigoPostal: 11908,
        territorio: 118.86,
        coordenadas: `9°19′55″N 83°34′27″O`,
        descripcionES: `Cajón es el distrito número ocho del cantón de Pérez Zeledón, tiene como sus distritos colindantes a El General, una pequeña parte de Platanares, una pequeña parte con Daniel Flores, una pequeña parte con Pejibaye, San Pedro y una pequeña parte de Rivas. El tres de marzo de 1970 se creó y se delimitó el distrito de Cajón partiendo de la afluencia de los ríos Unión y General aguas arriba El distrito de Cajón de Pérez Zeledón, posee una extensión de 118.86 kilómetros cuadrados y una población de 8542 de habitantes, y una altitud media de 658 m.s.n.m. Cuenta con un total de 14 comunidades las cuales son: Cajón (centro), Pueblo Nuevo, Quizarrá de Cajón, Mercedes, Navajuelar, Cedral, El Carmen, El Pilar, San Ignacio, Santa Teresa, San Pedrito, Las Brisas, Santa María, y San Francisco. En general, el turismo abarca tours alrededor de fincas, producciones de café reconocidas internacionalmente, trucheros y con un gran potencial en turismo gastronómico. Es un distrito que proyecta una imagen de ruralidad con paisajes tranquilos, donde el visitante se pueda sentir fuera de la tensión del mundo laboral de las grandes ciudades, y entrar en contacto con ciudadanos auténticos, sin pretensiones y en su habitualidad.`,
        descripcionEN: `Cajón is the eighth district of the canton of Pérez Zeledón, has as its neighboring districts El General, a small part of Platanares, a small part with Daniel Flores, a small part with Pejibaye, San Pedro and a small part of Rivas. On March 3, 1970, the district of Cajón was created and delimited from the affluence of the Unión and General rivers upstream. The district of Cajón de Pérez Zeledón has an area of 118.86 square kilometers and a population of 8542 inhabitants, and an average altitude of 658 meters above sea level. It has a total of 14 communities which are: Cajón (center), Pueblo Nuevo, Quizarrá de Cajón, Mercedes, Navajuelar, Cedral, El Carmen, El Pilar, San Ignacio, Santa Teresa, San Pedrito, Las Brisas, Santa María, and San Francisco. In general, tourism includes tours around farms, internationally recognized coffee production, trout fishing, and there is great potential for gastronomic tourism. It is a district that projects an image of rurality with calm landscapes, where visitors can feel away from the stress of the working world or the big cities, and come into contact with authentic citizens, unpretentious and in their daily lives.`,
        urlVideo: 'https://youtu.be/PM6l3dhvmbg',
    },
    {
        nombre: "Barú",
        id: "baru",
        imagen: "/img/distritos/Distrito-11.png",
        poblacion: 2393,
        codigoPostal: 11909,
        territorio: 191.42,
        coordenadas: `9°19′13″N 83°49′39″O`,
        descripcionES: `Barú fue fundado en el año 1983 convirtiéndose en el noveno distrito del cantón de Pérez Zeledón (Arce L, 2006), posee los límites geográficos de: al Norte con Río Nuevo, al Este con San Isidro del General, al Sur con el Cantón de Osa y al Oeste con el Cantón Aguirre, además el mismo cuenta con una extensión territorial de 189.08 km² compuesto por más de 15 poblados en donde Platanillo es considerado la cabecera de distrito. Este distrito es caracterizado por poseer con un enorme potencial turístico disperso por todo el territorio, el cual se encuentra dividido en distintas categorías en donde la predominante es la de sitio natural y de manera específica el tipo de caídas de agua.`,
        descripcionEN: `Barú was founded in 1983 becoming the ninth district of the canton of Pérez Zeledón (Arce L, 2006), has the geographical limits of: to the North with Rio Nuevo, to the East with San Isidro del General, to the South with the Canton of Osa and to the West with the Canton Aguirre, it also has a land area of 189.08 km² composed of more than 15 villages where Platanillo is considered the main one of the district. This district is characterized by having an enormous tourist potential scattered throughout the territory, which is divided into different categories where the predominant one is the natural and the type of waterfalls.`,
        urlVideo: 'https://youtu.be/BM-Z2mdDEAs',
    },
    {
        nombre: "Río Nuevo",
        id: "rionuevo",
        imagen: "/img/distritos/Distrito-09.png",
        poblacion: 3061,
        codigoPostal: 11910,
        territorio: 240.68,
        coordenadas: `9°27′05″N 83°52′12″O`,
        descripcionES: `Río Nuevo es el distrito número diez del cantón de Pérez Zeledón el cual tiene una extensión de, 248.68 kilómetros cuadrados, la cabecera de distrito es Santa Rosa. Cuenta con una población de aproximadamente 3061 habitantes, según el censo del 2011 del INEC. Río Nuevo está compuesto por estos poblados, barrios, caseríos según Manual de clasificación geográfica con fines estadísticos de Costa Rica del INEC 2016. Estos son los poblados de Rio Nuevo, California, Calle Mora, Calle Mora Arrieta, Cerro San Antonio, El Brujo, El Llano, El Pedregal, El Silencio, Fila Alto Zopilote, Fila Bruja, Fila Pavón, Fila Temblor, Piedras Blancas, Providencia, San Cayetano, Santa Lucía, Santa Marta, Santa Rosa, Savegre Abajo, Savegre Arriba, Zaragoza. Los siguientes poblados y caseríos: Santa Rosa, California, Calle Mora, Cerro San Antonio, El Brujo, Calle Mora Arrieta, El Llano, El Pedregal, El Silencio, Fila Alto Zopilote, Fila Bruja, Fila Pavón, Fila Temblor, Piedras Blancas, Providencia, San Cayetano, Santa Lucía, Santa Marta, Savegre Abajo, Savegre Arriba y Zaragoza, según el Manual de Clasificación Geográfica con fines estadísticos de Costa Rica del INEC 2016.        Las comunidades y barrios de este distrito en su mayoría son rurales y poseen gran cantidad de riqueza natural. La parte turística de este distrito no se encuentra muy desarrollada, sin embargo cuenta con atractivos competentes, como atractivos potenciales, sobre todo en la categoría de atractivos naturales y de folclor. Uno de los principales atractivos es el Río Savegre, el cual es catalogado como uno de los más limpios de Centroamérica, como también lo que es las Cavernas de Olla Quemada con su exuberante belleza natural. Resaltado el folclor de la zona, se puede mencionar los diferentes trapiches, más aquellas fiestas tradicionales que realizan en Río Nuevo. `,
        descripcionEN: `Rio Nuevo is the tenth district of the canton of Pérez Zeledón which has an area of 248.68 square kilometers, the district's capital is Santa Rosa. It has a population of approximately 3061 inhabitants, according to the 2011 INEC census. Rio Nuevo is composed of these towns, neighborhoods, hamlets according to the Geographic Classification Manual for statistical purposes of Costa Rica of INEC 2016. These are the villages of Rio Nuevo, California, Calle Mora, Calle Mora Arrieta, Cerro San Antonio, El Brujo, El Llano, El Pedregal, El Silencio, Fila Alto Zopilote, Fila Bruja, Fila Pavón, Fila Temblor, Piedras Blancas, Providencia, San Cayetano, Santa Lucía, Santa Marta, Santa Rosa, Savegre Abajo, Savegre Arriba, Zaragoza. The following towns and hamlets: Santa Rosa, California, Calle Mora, Cerro San Antonio, El Brujo, Calle Mora Arrieta, El Llano, El Pedregal, El Silencio, Fila Alto Zopilote, Fila Bruja, Fila Pavón, Fila Temblor, Piedras Blancas, Providencia, San Cayetano, Santa Lucía, Santa Marta, Savegre Abajo, Savegre Arriba, and Zaragoza, according to the Manual of Geographic classification with statistic matters of Costa Rica from INEC 2016. The communities and neighborhoods of this district are mostly rural and have great natural wealth. The tourist part of this district is not very developed, however, it has competent attractions, as potential attractions, especially in the category of natural and folkloric attractions. One of the main interests is the Savegre River, cataloged as one of the cleanest in Central America, as well as the Olla Quemada Caves with their exuberant natural beauty. The folklore of the area is highlighted by the different trapiches (sugar cane mills), as well as the traditional festivities that take place in Río Nuevo.`,
        urlVideo: 'https://youtu.be/G52w4zsczQ8',
    },
    {
        nombre: "Páramo",
        id: "paramo",
        imagen: "/img/distritos/Distrito-10.png",
        poblacion: 4410,
        codigoPostal: 11911,
        territorio: 203.17,
        coordenadas: `9°29′34″N 83°45′54″O`,
        descripcionES: `Páramo es el distrito número once del cantón de Pérez Zeledón, provincia de San José. Su principal centro de población es San Ramón Sur.  En el distrito se encuentra la mayor diversidad de flora y fauna del cantón, además cabe mencionar que cuenta con una población de aproximadamente 4410 habitantes. El clima de este distrito es variado, ya que en los bajos de San Ramón Sur es caliente y en nivel, así como en División, se siente el frío del Cerro de La Muerte. Además, el distrito cuenta con distintos poblados como lo son: Pedregosito, Providencia, San Ramón Sur, Matasanos, San Ramón Norte, San Miguel, Berlín, Valencia, La Ese, Santa Eduviges, Santo Tomás, Los Ángeles, La Lira, La Hortensia, El Jardín, División, Siberia, Fortuna, la Palma, Alto Macho Mora, Chanchera, La Piedra. Los recursos naturales que se pueden apreciar son tan variados como hermosos, entre ellos podemos mencionar los bosques del Tolomuco, los miradores al Valle de El General a la altura del Cerro de la Muerte, cavernas, distintas pozas y cataratas, fincas, y muchos lugares más. Los pueblos que comprenden el recurso humano en este territorio son en su mayoría rurales, que se dedican a la actividad agrícola y al turismo. Es importante destacar la actividad cafetalera en la zona de Los Ángeles de Páramo y zonas aledañas, el cultivo de productos como la mora en los pueblos del Bajo del Jaular y Macho Mora, que le agregan un distintivo a la zona. Asimismo, un segmento de la población se dedica a la ganadería y a toda actividad relacionada con los lácteos, también se da la siembra de caña dulce, por lo que podemos encontrar distintos trapiches en la zona que fabrican la tapa de dulce. `,
        descripcionEN: `Páramo is the eleventh district of the canton of Pérez Zeledón, province of San José. Its main population center is San Ramón Sur. In the district you can find the greatest diversity of flora and fauna of the canton, it is also worth mentioning that it has a population of approximately 4410 inhabitants. The climate of this district is varied, since in the lowlands of San Ramón Sur it is hot and at the level, as well as in División, the cold of Cerro de La Muerte is felt. In addition, the district has different towns such as: Pedregosito, Providencia, San Ramón Sur, Matasanos, San Ramón Norte, San Miguel, Berlín, Valencia, La Ese, Santa Eduviges, Santo Tomás, Los Ángeles, La Lira, La Hortensia, El Jardín, División, Siberia, Fortuna, la Palma, Alto Macho Mora, Chanchera, La Piedra. The natural resources that can be appreciated are as varied as beautiful, among them we can mention the forests of Tolomuco, the viewpoints to the Valley of El General at the height of Cerro de la Muerte, caves, different pools and waterfalls, farms, and many more places. The towns that comprise the human resources in this territory are mostly rural, dedicated to agriculture and tourism. It is important to highlight the coffee activity in the area of Los Ángeles de Páramo and surrounding areas, the cultivation of products such as blackberries in the towns of Bajo del Jaular and Macho Mora, which add a distinctive feature to the area. Likewise, a segment of the population is dedicated to cattle raising and all activities related to dairy products. There is also the planting of sweet cane, so we can find different sugar cane mills in the area that manufacture of the sweet tapa.`,
        urlVideo: 'https://youtu.be/piYUYLmQ7zU',
    },
    {
        nombre: "La Amistad",
        id: "laamistad",
        imagen: "/img/distritos/Distrito-12.png",
        poblacion: -1,
        codigoPostal: 11912,
        territorio: 76.11,
        coordenadas: `9°12′02″N 83°32′23″O`,
        descripcionES: `El nuevo distrito generaleño es una zona cafetalera y ganadera; entre ambas actividades concentran unas 8.300 hectáreas y reúnen unos 1400 productores. Con el paso del tiempo la producción agropecuaria se ha diversificado con cultivos como rambután, maderas, naranja dulce, plantas ornamentales, piña y yuca para exportación. De igual forma ha habido un gran auge en la producción de productos orgánicos; especialmente, café y piña, con lo cual se contribuye al progreso en armonía con el ambiente. También se contabilizan más de 40 establecimientos, entre ellos tiendas de abarrotes, supermercados, talleres mecánicos, planta procesadora de café.`,
        descripcionEN: `The new generaleño district is a coffee and cattle raising area; between both activities they concentrate about 8,300 hectares and gather about 1,400 producers. Over time, agricultural production has diversified with crops such as rambutan, timber, sweet oranges, ornamental plants, pineapple and cassava for export. There has also been a boom in the production of organic products, especially coffee and pineapple, which contributes to progress in harmony with the environment. There are also more than 40 establishments, including grocery stores, supermarkets, mechanical workshops, coffee processing plant.`,
        urlVideo: 'https://youtu.be/m-nbCoUMnmU',
    }
];

// Ficha por segmento de URL, o null.
export function fichaPorSlug(slug: string | undefined): FichaDistrito | null {
  if (!slug) return null;
  return FICHAS_DISTRITO.find((d) => d.id === slug.toLowerCase()) ?? null;
}
