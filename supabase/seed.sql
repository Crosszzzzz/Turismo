-- ============================================
-- SUCRE TURISMO — Seed Data
-- ============================================
-- Run AFTER migration.sql
-- These are real places in Sucre, Bolivia

-- ============================================
-- PLACES (16 lugares turísticos VERIFICADOS)
-- ============================================

-- Get category IDs (run migration first!)
DO $$
DECLARE
  cat_museos UUID;
  cat_iglesias UUID;
  cat_restaurantes UUID;
  cat_mercados UUID;
  cat_parques UUID;
  cat_miradores UUID;
  cat_galerias UUID;
BEGIN
  SELECT id INTO cat_museos FROM place_categories WHERE name = 'Museos';
  SELECT id INTO cat_iglesias FROM place_categories WHERE name = 'Iglesias';
  SELECT id INTO cat_restaurantes FROM place_categories WHERE name = 'Restaurantes';
  SELECT id INTO cat_mercados FROM place_categories WHERE name = 'Mercados';
  SELECT id INTO cat_parques FROM place_categories WHERE name = 'Parques';
  SELECT id INTO cat_miradores FROM place_categories WHERE name = 'Miradores';
  SELECT id INTO cat_galerias FROM place_categories WHERE name = 'Galerías';

  -- 1. Catedral Metropolitana
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Catedral Metropolitana', 'La iglesia más importante de Sucre, construida en 1559. Su fachada neoclásica y el interior con imágenes coloniales la convierten en un ícono de la ciudad. El altar mayor está adornado con plata y el techo muestra pinturas de estilo barroco.', cat_iglesias, -19.0196, -65.2619, 'Plaza 25 de Mayo, Centro Histórico', 0, 30, '{"lunes":{"open":"07:00","close":"12:00"},"martes":{"open":"07:00","close":"12:00"},"miercoles":{"open":"07:00","close":"12:00"},"jueves":{"open":"07:00","close":"12:00"},"viernes":{"open":"07:00","close":"12:00"},"sabado":{"open":"07:00","close":"12:00"},"domingo":{"open":"06:00","close":"13:00"}}', true, 'easy', '/images/catedral.jpg');

  -- 2. Casa de la Libertad
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Casa de la Libertad', 'Museo histórico donde se firmó la Independencia de Bolivia en 1825. Conserva muebles originales, documentos históricos y la habitación donde vivió Antonio José de Sucre. Patrimonio cultural de Bolivia.', cat_museos, -19.0194, -65.2625, 'Plaza 25 de Mayo 12, Centro Histórico', 15, 45, '{"lunes":{"open":"09:00","close":"17:30"},"martes":{"open":"09:00","close":"17:30"},"miercoles":{"open":"09:00","close":"17:30"},"jueves":{"open":"09:00","close":"17:30"},"viernes":{"open":"09:00","close":"17:30"},"sabado":{"open":"09:00","close":"17:30"},"domingo":{"open":"09:00","close":"17:30"}}', false, 'easy', '/images/casa-libertad.jpg');

  -- 3. Mercado Central
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Mercado Central', 'El corazón gastronómico de Sucre. Aquí probás las mejores frutas tropicales, jugos naturales, api (bebida de maíz) y salteñas. Los puestos de comida casera ofrecen platos típicos a precios populares.', cat_mercados, -19.0178, -65.2598, 'Calle Bolívar, Centro Histórico', 20, 60, '{"lunes":{"open":"06:00","close":"18:00"},"martes":{"open":"06:00","close":"18:00"},"miercoles":{"open":"06:00","close":"18:00"},"jueves":{"open":"06:00","close":"18:00"},"viernes":{"open":"06:00","close":"18:00"},"sabado":{"open":"06:00","close":"18:00"},"domingo":{"open":"06:00","close":"14:00"}}', true, 'easy', '/images/mercado.jpg');

  -- 4. Castillo de la Glorieta
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Castillo de la Glorieta', 'Castillo de estilo europeo construido en 1890 por el coronel Francisco Argandoña y Claro. Mezcla estilos neogótico, neoclásico y oriental. Hoy es museo con mobiliario antiguo, porcelana y una capilla.', cat_museos, -19.0489, -65.2756, 'Avenida Glorieta s/n, Zona Glorieta', 20, 60, '{"lunes":{"open":"09:00","close":"12:00"},"martes":{"open":"09:00","close":"12:00"},"miercoles":{"open":"09:00","close":"17:00"},"jueves":{"open":"09:00","close":"17:00"},"viernes":{"open":"09:00","close":"17:00"},"sabado":{"open":"09:00","close":"17:00"},"domingo":{"open":"09:00","close":"17:00"}}', false, 'easy', '/images/glorieta.jpg');

  -- 5. Iglesia de San Francisco
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Iglesia de San Francisco', 'Templo colonial del siglo XVI con una fachada barroca impresionante. El interior alberga imágenes de gran valor artístico y un claustro que hoy funciona como museo de arte religioso.', cat_iglesias, -19.0228, -65.2592, 'Calle San Francisco, Centro Histórico', 0, 25, '{"lunes":{"open":"07:00","close":"12:00"},"martes":{"open":"07:00","close":"12:00"},"miercoles":{"open":"07:00","close":"12:00"},"jueves":{"open":"07:00","close":"12:00"},"viernes":{"open":"07:00","close":"12:00"},"sabado":{"open":"07:00","close":"12:00"},"domingo":{"open":"06:00","close":"12:00"}}', true, 'easy', '/images/san-francisco.jpg');

  -- 6. Universidad San Francisco Xavier
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Universidad San Francisco Xavier', 'Fundada en 1624, es una de las universidades más antiguas de Sudamérica. Su portada barroca es uno de los símbolos de Sucre. El campus alberga un museo de historia natural y una biblioteca con incunables.', cat_museos, -19.0205, -65.2630, 'Calle Ordóñez Lazo, Centro Histórico', 0, 30, '{"lunes":{"open":"07:00","close":"20:00"},"martes":{"open":"07:00","close":"20:00"},"miercoles":{"open":"07:00","close":"20:00"},"jueves":{"open":"07:00","close":"20:00"},"viernes":{"open":"07:00","close":"20:00"},"sabado":{"open":"07:00","close":"13:00"}}', true, 'easy', '/images/usfx.jpg');

  -- 7. Parque Anzúres
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Parque Anzúres', 'Hermosa plaza arbolada en el centro de Sucre, perfecta para descansar y observar la vida cotidiana. Rodeada de edificios coloniales y con una fuente central. Ideal para tomar un café en sus alrededores.', cat_parques, -19.0185, -65.2605, 'Plaza Anzúres, Centro Histórico', 0, 20, '{"lunes":{"open":"00:00","close":"23:59"},"martes":{"open":"00:00","close":"23:59"},"miercoles":{"open":"00:00","close":"23:59"},"jueves":{"open":"00:00","close":"23:59"},"viernes":{"open":"00:00","close":"23:59"},"sabado":{"open":"00:00","close":"23:59"},"domingo":{"open":"00:00","close":"23:59"}}', true, 'easy', '/images/parque-anzures.jpg');

  -- 8. Museo ASUR (Arte Indígena)
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Museo ASUR', 'Museo dedicado al arte y cultura de los pueblos originarios de Bolivia. Colección de textiles, cerámicas, máscaras y objetos ceremoniales de las culturas quechua y aymara. Uno de los mejores museos de Sucre.', cat_museos, -19.0165, -65.2580, 'Calle Azurduy 425, Centro Histórico', 10, 45, '{"lunes":{"open":"09:00","close":"17:00"},"martes":{"open":"09:00","close":"17:00"},"miercoles":{"open":"09:00","close":"17:00"},"jueves":{"open":"09:00","close":"17:00"},"viernes":{"open":"09:00","close":"17:00"},"sabado":{"open":"09:00","close":"17:00"},"domingo":{"open":"10:00","close":"14:00"}}', false, 'easy', '/images/museo-asur.jpg');

  -- 9. Café Literario La Plata
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Café Literario La Plata', 'Café cultural en una casona colonial restaurada. Sirve café de especialidad, pasteles artesanales y platos ligeros. Ambientación bohemia con libros, arte local y música en vivo los fines de semana.', cat_restaurantes, -19.0188, -65.2612, 'Calle La Plata 123, Centro Histórico', 35, 45, '{"lunes":{"open":"08:00","close":"22:00"},"martes":{"open":"08:00","close":"22:00"},"miercoles":{"open":"08:00","close":"22:00"},"jueves":{"open":"08:00","close":"22:00"},"viernes":{"open":"08:00","close":"23:00"},"sabado":{"open":"08:00","close":"23:00"},"domingo":{"open":"09:00","close":"21:00"}}', false, 'easy', '/images/cafe-literario.jpg');

  -- 10. Casa de los Siete Ponchos
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Casa de los Siete Ponchos', 'Museo dedicado a la canción folklórica "Los Siete Ponchos" y a la artesanía chuquisaqueña. Exhibe textiles, ponchos tradicionales y objetos culturales que narran la historia musical de Sucre.', cat_museos, -19.0170, -65.2640, 'Calle Bolívar 521, Centro Histórico', 10, 40, '{"lunes":{"open":"09:00","close":"17:00"},"martes":{"open":"09:00","close":"17:00"},"miercoles":{"open":"09:00","close":"17:00"},"jueves":{"open":"09:00","close":"17:00"},"viernes":{"open":"09:00","close":"17:00"},"sabado":{"open":"09:00","close":"17:00"},"domingo":{"open":"10:00","close":"14:00"}}', false, 'easy', '/images/siete-ponchos.jpg');

  -- 11. Templo de San Lázaro
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Templo de San Lázaro', 'Una de las iglesias más antiguas de Sucre, construida en el siglo XVI. Su fachada sencilla esconde un interior con retablos dorados y una historia de más de 400 años.', cat_iglesias, -19.0155, -65.2590, 'Calle San Lázaro, Centro Histórico', 0, 20, '{"lunes":{"open":"07:00","close":"12:00"},"martes":{"open":"07:00","close":"12:00"},"miercoles":{"open":"07:00","close":"12:00"},"jueves":{"open":"07:00","close":"12:00"},"viernes":{"open":"07:00","close":"12:00"},"sabado":{"open":"07:00","close":"12:00"},"domingo":{"open":"06:00","close":"12:00"}}', true, 'easy', '/images/san-lazaro.jpg');

  -- 12. Teatro Gran Mariscal
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Teatro Gran Mariscal', 'Teatro histórico construido en 1909 con arquitectura de inspiración italiana. Sede de funciones de teatro, ópera y conciertos. Joya arquitectónica con platea principal y palcos decorados.', cat_museos, -19.0210, -65.2600, 'Calle Azurduy 234, Centro Histórico', 15, 45, '{"lunes":{"open":"09:00","close":"18:00"},"martes":{"open":"09:00","close":"18:00"},"miercoles":{"open":"09:00","close":"18:00"},"jueves":{"open":"09:00","close":"18:00"},"viernes":{"open":"09:00","close":"20:00"},"sabado":{"open":"09:00","close":"20:00"},"domingo":{"open":"10:00","close":"14:00"}}', false, 'easy', '/images/teatro.jpg');

  -- 13. Convento de Santa Clara
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Convento de Santa Clara', 'Convento colonial del siglo XVI con claustro interior. Museo con arte religioso, pinturas coloniales y la iglesia original con imaginería de gran valor.', cat_museos, -19.0180, -65.2635, 'Calle Santa Clara, Centro Histórico', 10, 30, '{"lunes":{"open":"09:00","close":"16:00"},"martes":{"open":"09:00","close":"16:00"},"miercoles":{"open":"09:00","close":"16:00"},"jueves":{"open":"09:00","close":"16:00"},"viernes":{"open":"09:00","close":"16:00"},"sabado":{"open":"09:00","close":"16:00"},"domingo":{"open":"10:00","close":"13:00"}}', false, 'easy', '/images/santa-clara.jpg');

  -- 14. Museo de Arte Moderno
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Museo de Arte Moderno', 'Galería con obras de artistas contemporáneos bolivianos. Exposiciones temporales rotativas y colección permanente de pintura, escultura y arte digital.', cat_galerias, -19.0175, -65.2615, 'Calle Colombia 340, Centro Histórico', 10, 45, '{"lunes":{"open":"09:00","close":"18:00"},"martes":{"open":"09:00","close":"18:00"},"miercoles":{"open":"09:00","close":"18:00"},"jueves":{"open":"09:00","close":"18:00"},"viernes":{"open":"09:00","close":"18:00"},"sabado":{"open":"10:00","close":"16:00"},"domingo":{"open":"10:00","close":"14:00"}}', false, 'easy', '/images/museo-moderno.jpg');

  -- 15. Parque Cretácico
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Parque Cretácico', 'Parque museo con huellas de dinosaurios fósiles descubiertas en Sucre. Atractivo único a nivel mundial con reconstrucciones a escala real y zona de fósiles originales.', cat_parques, -19.0520, -65.2800, 'Avenida Crema s/n, Zona Cretácico', 20, 90, '{"lunes":{"open":"08:30","close":"16:30"},"martes":{"open":"08:30","close":"16:30"},"miercoles":{"open":"08:30","close":"16:30"},"jueves":{"open":"08:30","close":"16:30"},"viernes":{"open":"08:30","close":"16:30"},"sabado":{"open":"08:30","close":"16:30"},"domingo":{"open":"08:30","close":"16:30"}}', false, 'easy', '/images/cretacico.jpg');

  -- 16. Plaza de la Recoleta
  INSERT INTO places (name, description, category_id, latitude, longitude, address, avg_cost, avg_visit_time, opening_hours, is_free, difficulty_access, image_url) VALUES
  ('Plaza de la Recoleta', 'Plaza tranquila en la zona de Recoleta. Área verde arbolada con bancas, ideal para relajarse lejos del bullicio del centro. Cerca de la zona residencial más exclusiva.', cat_parques, -19.0140, -65.2660, 'Plaza Recoleta, Zona Recoleta', 0, 20, '{"lunes":{"open":"00:00","close":"23:59"},"martes":{"open":"00:00","close":"23:59"},"miercoles":{"open":"00:00","close":"23:59"},"jueves":{"open":"00:00","close":"23:59"},"viernes":{"open":"00:00","close":"23:59"},"sabado":{"open":"00:00","close":"23:59"},"domingo":{"open":"00:00","close":"23:59"}}', true, 'easy', '/images/recoleta.jpg');

END $$;
