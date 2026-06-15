-- =============================================================
-- V6__seed_data.sql
-- Datos de prueba para Fase 2
-- =============================================================

-- 1. USUARIOS ---------------------------------------------------

INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, email_verified, provider)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@test.com',
     '$2a$10$aF4R7wjuSBA9bUDtcnlR/OPO8v5ID/zmPj5wMt04w477Q.cf3yKLC',
     'Admin', 'Principal', 'ADMIN', 'ACTIVE', true, 'LOCAL'),
    ('00000000-0000-0000-0000-000000000002', 'user@test.com',
     '$2a$10$u3MyopSX4BU6cn0G1aCuOuZv44esK1z6BnDNlf7JuRo44aot6Luzi',
     'Usuario', 'Prueba', 'CUSTOMER', 'ACTIVE', true, 'LOCAL');

-- 2. CATEGORÍAS --------------------------------------------------

-- 2a. Categorías padre
INSERT INTO categories (id, name, slug, description, sort_order, is_active)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'Ropa', 'ropa',
     'Prendas de vestir para todas las ocasiones', 1, true),
    ('10000000-0000-0000-0000-000000000002', 'Accesorios', 'accesorios',
     'Complementos que marcan la diferencia', 2, true),
    ('10000000-0000-0000-0000-000000000003', 'Calzado', 'calzado',
     'Zapatos, tenis y botas para cada estilo', 3, true);

-- 2b. Subcategorías Ropa
INSERT INTO categories (id, name, slug, description, parent_id, sort_order, is_active)
VALUES
    ('10000000-0000-0000-0000-000000000010', 'Camisas', 'camisas',
     'Camisas formales y casuales', '10000000-0000-0000-0000-000000000001', 1, true),
    ('10000000-0000-0000-0000-000000000011', 'Pantalones', 'pantalones',
     'Pantalones de vestir, casuales y jeans', '10000000-0000-0000-0000-000000000001', 2, true),
    ('10000000-0000-0000-0000-000000000012', 'Chaquetas', 'chaquetas',
     'Chaquetas y abrigos para cualquier clima', '10000000-0000-0000-0000-000000000001', 3, true);

-- 2c. Subcategorías Accesorios
INSERT INTO categories (id, name, slug, description, parent_id, sort_order, is_active)
VALUES
    ('10000000-0000-0000-0000-000000000020', 'Bolsos', 'bolsos',
     'Bolsos, mochilas y carteras', '10000000-0000-0000-0000-000000000002', 1, true),
    ('10000000-0000-0000-0000-000000000021', 'Relojes', 'relojes',
     'Relojes clásicos y deportivos', '10000000-0000-0000-0000-000000000002', 2, true),
    ('10000000-0000-0000-0000-000000000022', 'Joyería', 'joyeria',
     'Collares, pulseras y anillos', '10000000-0000-0000-0000-000000000002', 3, true);

-- 2d. Subcategorías Calzado
INSERT INTO categories (id, name, slug, description, parent_id, sort_order, is_active)
VALUES
    ('10000000-0000-0000-0000-000000000030', 'Zapatos', 'zapatos',
     'Zapatos formales y casuales', '10000000-0000-0000-0000-000000000003', 1, true),
    ('10000000-0000-0000-0000-000000000031', 'Tenis', 'tenis',
     'Tenis deportivos y urbanos', '10000000-0000-0000-0000-000000000003', 2, true),
    ('10000000-0000-0000-0000-000000000032', 'Botas', 'botas',
     'Botas para todas las temporadas', '10000000-0000-0000-0000-000000000003', 3, true);

-- 3. PRODUCTOS ---------------------------------------------------

-- 3a. Camisas (5 productos)
INSERT INTO products (id, category_id, name, slug, description, short_description, sku, brand, status, is_featured, base_price, compare_price, stock, tags, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000010',
     'Camisa Blanca Classic Fit',
     'camisa-blanca-classic-fit',
     'Camisa blanca de corte clásico en algodón premium. Perfecta para ocasiones formales y casuales. Confeccionada con tejido de punto suave que brinda comodidad durante todo el día. Cuello clásico y puños ajustables.',
     'Camisa blanca de algodón premium, corte clásico',
     'CAM-BLA-001', 'MAISON Collection', 'ACTIVE', true, 899.00, 1299.00, 50,
     ARRAY['clásico', 'formal', 'algodón'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000002',
     '10000000-0000-0000-0000-000000000010',
     'Camisa Azul Oxford',
     'camisa-azul-oxford',
     'Camisa estilo Oxford en azul marino. Tejido de alta durabilidad con un acabado ligeramente texturizado. Ideal para looks semifor males o para combinar con jeans y chinos.',
     'Camisa Oxford azul, duradera y versátil',
     'CAM-AZU-002', 'MAISON Collection', 'ACTIVE', true, 749.00, NULL, 35,
     ARRAY['oxford', 'casual', 'versátil'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000003',
     '10000000-0000-0000-0000-000000000010',
     'Camisa de Lino Beige',
     'camisa-lino-beige',
     'Camisa de lino 100% natural en tono beige. Fresca y ligera, perfecta para días cálidos. Corte relajado con botones de concha natural.',
     'Camisa de lino beige, fresca y ligera',
     'CAM-LIN-003', 'Natural Fiber Co.', 'ACTIVE', false, 1099.00, 1399.00, 20,
     ARRAY['lino', 'verano', 'natural'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000004',
     '10000000-0000-0000-0000-000000000010',
     'Camisa Negra Slim Fit',
     'camisa-negra-slim-fit',
     'Camisa negra de corte ajustado moderna. Elegante y sofisticada, perfecta para cenas y eventos. Detalle de botones negros mate y costuras reforzadas.',
     'Camisa negra slim fit moderna',
     'CAM-NEG-004', 'Urban Elegance', 'ACTIVE', true, 949.00, NULL, 40,
     ARRAY['slim', 'elegante', 'moderna'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000005',
     '10000000-0000-0000-0000-000000000010',
     'Camisa Casual Cuadros',
     'camisa-casual-cuadros',
     'Camisa casual de cuadros en tonos rojos y negros. Tejido de franela suave para los días frescos. Ideal para un look relajado de fin de semana.',
     'Camisa de franela a cuadros',
     'CAM-CUA-005', 'Rustic Weave', 'ACTIVE', false, 649.00, 849.00, 25,
     ARRAY['casual', 'cuadros', 'franela'], '00000000-0000-0000-0000-000000000001');

-- 3b. Pantalones (5 productos)
INSERT INTO products (id, category_id, name, slug, description, short_description, sku, brand, status, is_featured, base_price, compare_price, stock, tags, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000006',
     '10000000-0000-0000-0000-000000000011',
     'Pantalón de Vestir Gris',
     'pantalon-vestir-gris',
     'Pantalón de vestir en gris carbón. Corte recto con tela de lana mezcla. Perfecto para oficina y eventos formales. Pretina con trabillas para cinturón.',
     'Pantalón de vestir gris carbón',
     'PAN-GRI-006', 'MAISON Collection', 'ACTIVE', true, 1299.00, 1599.00, 30,
     ARRAY['formal', 'vestir', 'oficina'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000007',
     '10000000-0000-0000-0000-000000000011',
     'Jeans Clásico Azul',
     'jeans-clasico-azul',
     'Jeans clásicos de corte regular en azul índigo. Algodón denim de alta calidad con elasticidad para mayor comodidad. Cinco bolsillos y cierre de botón.',
     'Jeans clásicos azul índigo',
     'PAN-JEA-007', 'Denim Lab', 'ACTIVE', true, 999.00, NULL, 60,
     ARRAY['jeans', 'clásico', 'denim'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000008',
     '10000000-0000-0000-0000-000000000011',
     'Chino Beige',
     'chino-beige',
     'Pantalón chino en beige. Corte slim recto, ideal para looks casuales pero pulcros. Tejido de algodón sarga con acabado suave al tacto.',
     'Pantalón chino beige slim',
     'PAN-CHI-008', 'MAISON Collection', 'ACTIVE', false, 849.00, NULL, 45,
     ARRAY['chino', 'casual', 'cómodo'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000009',
     '10000000-0000-0000-0000-000000000011',
     'Pantalón Cargo Verde',
     'pantalon-cargo-verde',
     'Pantalón cargo en verde olivo con múltiples bolsillos. Corte holgado y cómodo, perfecto para actividades al aire libre. Tela resistente con costuras reforzadas.',
     'Pantalón cargo verde olivo',
     'PAN-CAR-009', 'Trail Gear', 'ACTIVE', false, 799.00, 999.00, 15,
     ARRAY['cargo', 'outdoor', 'resistente'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000010',
     '10000000-0000-0000-0000-000000000011',
     'Pantalón de Mezclilla Negro',
     'pantalon-mezclilla-negro',
     'Pantalón de mezclilla en negro intenso. Corte moderno ajustado con ligera elasticidad. Perfecto para looks nocturnos o urbanos.',
     'Jeans negro ajustado moderno',
     'PAN-MEZ-010', 'Denim Lab', 'ACTIVE', true, 1049.00, NULL, 35,
     ARRAY['mezclilla', 'negro', 'moderno'], '00000000-0000-0000-0000-000000000001');

-- 3c. Chaquetas (5 productos)
INSERT INTO products (id, category_id, name, slug, description, short_description, sku, brand, status, is_featured, base_price, compare_price, stock, tags, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000011',
     '10000000-0000-0000-0000-000000000012',
     'Chaqueta de Cuero Marrón',
     'chaqueta-cuero-marron',
     'Chaqueta de cuero genuino en marrón oscuro. Cierre de cremallera frontal, cuello solapa y bolsillos con cremallera. Un clásico atemporal que nunca pasa de moda.',
     'Chaqueta de cuero genuino marrón',
     'CHA-CUE-011', 'Heritage Leather', 'ACTIVE', true, 3499.00, 4299.00, 10,
     ARRAY['cuero', 'clásico', 'atemporal'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000012',
     '10000000-0000-0000-0000-000000000012',
     'Chaqueta Impermeable Negra',
     'chaqueta-impermeable-negra',
     'Chaqueta impermeable técnica en negro. Membrana transpirable que mantiene seco sin sacrificar comodidad. Capucha ajustable y múltiples bolsillos sellados.',
     'Chaqueta impermeable técnica negra',
     'CHA-IMP-012', 'Trail Gear', 'ACTIVE', false, 2199.00, NULL, 20,
     ARRAY['impermeable', 'técnica', 'outdoor'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000013',
     '10000000-0000-0000-0000-000000000012',
     'Chamarra de Algodón Beige',
     'chamarra-algodon-beige',
     'Chamarra ligera de algodón en beige. Corte bomber clásico con cuello ribeteado. Perfecta para entretiempo o como capa adicional.',
     'Chamarra bomber ligera beige',
     'CHA-ALG-013', 'MAISON Collection', 'ACTIVE', true, 1499.00, 1799.00, 25,
     ARRAY['bomber', 'ligera', 'entretiempo'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000014',
     '10000000-0000-0000-0000-000000000012',
     'Abrigo de Lana Gris',
     'abrigo-lana-gris',
     'Abrigo largo de lana en gris perla. Corte clásico de doble botonadura. Forro interior de seda artificial. Perfecto para temporada de frío.',
     'Abrigo de lana gris doble botonadura',
     'CHA-LAN-014', 'MAISON Collection', 'ACTIVE', true, 4499.00, 5299.00, 8,
     ARRAY['abrigo', 'lana', 'invierno'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000015',
     '10000000-0000-0000-0000-000000000012',
     'Chaqueta Deportiva Azul',
     'chaqueta-deportiva-azul',
     'Chaqueta deportiva en azul marino con cremallera. Tejido fleece suave y cálido. Ideal para actividades al aire libre o uso diario en clima fresco.',
     'Chaqueta fleece deportiva azul',
     'CHA-DEP-015', 'Trail Gear', 'ACTIVE', false, 999.00, NULL, 30,
     ARRAY['deportiva', 'fleece', 'cálida'], '00000000-0000-0000-0000-000000000001');

-- 3d. Bolsos (3 productos)
INSERT INTO products (id, category_id, name, slug, description, short_description, sku, brand, status, is_featured, base_price, compare_price, stock, tags, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000016',
     '10000000-0000-0000-0000-000000000020',
     'Mochila Urbana Negra',
     'mochila-urbana-negra',
     'Mochila urbana en negro con compartimento para laptop de 15". Bolsillo frontal organizador, laterales para botella y respaldo acolchado. Cierre impermeable.',
     'Mochila urbana con compartimento laptop',
     'BOL-MOC-016', 'Urban Gear', 'ACTIVE', true, 1599.00, 1899.00, 20,
     ARRAY['mochila', 'urbana', 'laptop'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000017',
     '10000000-0000-0000-0000-000000000020',
     'Bolso Tote de Cuero',
     'bolso-tote-cuero',
     'Bolso tote de cuero genuino en color coñac. Amplio compartimento principal con bolsillo interior con cremallera. Asas robustas con remaches metálicos.',
     'Bolso tote de cuero coñac',
     'BOL-TOT-017', 'Heritage Leather', 'ACTIVE', true, 2899.00, NULL, 12,
     ARRAY['tote', 'cuero', 'elegante'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000018',
     '10000000-0000-0000-0000-000000000020',
     'Riñonera Casual Verde',
     'rinonera-casual-verde',
     'Riñonera ajustable en verde militar. Pequeña pero funcional con compartimentos organizadores. Correa ajustable para usar en cintura o cruzada.',
     'Riñonera verde militar ajustable',
     'BOL-RIN-018', 'Urban Gear', 'ACTIVE', false, 599.00, 799.00, 40,
     ARRAY['riñonera', 'casual', 'práctica'], '00000000-0000-0000-0000-000000000001');

-- 3e. Relojes (3 productos)
INSERT INTO products (id, category_id, name, slug, description, short_description, sku, brand, status, is_featured, base_price, compare_price, stock, tags, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000019',
     '10000000-0000-0000-0000-000000000021',
     'Reloj Clásico Dorado',
     'reloj-clasico-dorado',
     'Reloj de pulsera clásico con caja dorada y esfera blanca. Correa de cuero marrón. Movimiento de cuarzo suizo con fecha. Resistente al agua 30m.',
     'Reloj clásico dorado con correa de cuero',
     'REL-CLA-019', 'Timeless Watches', 'ACTIVE', true, 3999.00, 4599.00, 15,
     ARRAY['clásico', 'dorado', 'cuarzo'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000020',
     '10000000-0000-0000-0000-000000000021',
     'Reloj Deportivo Negro',
     'reloj-deportivo-negro',
     'Reloj deportivo digital con múltiples funciones. Cronómetro, GPS, monitor de frecuencia cardíaca y resistencia al agua 100m. Batería de larga duración.',
     'Reloj deportivo digital con GPS',
     'REL-DEP-020', 'Sportech', 'ACTIVE', false, 5499.00, 6499.00, 10,
     ARRAY['deportivo', 'digital', 'GPS'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000021',
     '10000000-0000-0000-0000-000000000021',
     'Reloj Minimalista Plateado',
     'reloj-minimalista-plateado',
     'Reloj minimalista con caja plateada delgada y esfera sin números. Correa de malla milanesa. Diseño escandinavo elegante para cualquier ocasión.',
     'Reloj minimalista plateado delgado',
     'REL-MIN-021', 'Nordic Design', 'ACTIVE', true, 2199.00, NULL, 25,
     ARRAY['minimalista', 'plateado', 'elegante'], '00000000-0000-0000-0000-000000000001');

-- 3f. Joyería (3 productos)
INSERT INTO products (id, category_id, name, slug, description, short_description, sku, brand, status, is_featured, base_price, compare_price, stock, tags, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000022',
     '10000000-0000-0000-0000-000000000022',
     'Collar de Plata con Ónix',
     'collar-plata-onix',
     'Collar de plata esterlina 925 con dije de ónix negro. Cadena delgada ajustable de 45-50cm. Piedra natural pulida con acabado brillante.',
     'Collar plata 925 con ónix negro',
     'JOY-COL-022', 'Silver Craft', 'ACTIVE', true, 1899.00, 2299.00, 18,
     ARRAY['plata', 'ónix', 'elegante'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000023',
     '10000000-0000-0000-0000-000000000022',
     'Pulsera de Cuero y Plata',
     'pulsera-cuero-plata',
     'Pulsera trenzada de cuero negro con cierre de plata esterlina. Ajustable mediante nudo deslizante. Diseño moderno y versátil.',
     'Pulsera de cuero negro con plata',
     'JOY-PUL-023', 'Silver Craft', 'ACTIVE', false, 699.00, NULL, 30,
     ARRAY['pulsera', 'cuero', 'plata'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000024',
     '10000000-0000-0000-0000-000000000022',
     'Anillo de Oro 18k',
     'anillo-oro-18k',
     'Anillo clásico de oro amarillo 18k con superficie pulida. Ancho 3mm. Perfecto como alianza o accesorio diario. Incluye estuche de presentación.',
     'Anillo de oro 18k clásico',
     'JOY-ANI-024', 'Luxury Gold', 'ACTIVE', true, 7999.00, 9499.00, 5,
     ARRAY['oro', 'anillo', 'lujo'], '00000000-0000-0000-0000-000000000001');

-- 3g. Zapatos (3 productos)
INSERT INTO products (id, category_id, name, slug, description, short_description, sku, brand, status, is_featured, base_price, compare_price, stock, tags, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000025',
     '10000000-0000-0000-0000-000000000030',
     'Zapatos Oxford Negros',
     'zapatos-oxford-negros',
     'Zapatos formales Oxford en cuero negro. Corte clásico con cordones abiertos. Suela de cuero y goma. Plantilla acolchada para comodidad todo el día.',
     'Zapatos Oxford de cuero negro',
     'ZAP-OXF-025', 'Heritage Leather', 'ACTIVE', true, 2799.00, 3299.00, 15,
     ARRAY['formal', 'oxford', 'cuero'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000026',
     '10000000-0000-0000-0000-000000000030',
     'Mocasín Café',
     'mocasin-cafe',
     'Mocasín en cuero café con detalles de costura contrastante. Suela de goma ligera. Diseño sin cordones fácil de poner y quitar.',
     'Mocasín de cuero café',
     'ZAP-MOC-026', 'Urban Comfort', 'ACTIVE', false, 1999.00, NULL, 22,
     ARRAY['mocasín', 'cómodo', 'casual'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000027',
     '10000000-0000-0000-0000-000000000030',
     'Zapatos Derby Marrón',
     'zapatos-derby-marron',
     'Zapatos Derby en cuero marrón con acabado brillante. Cordones cerrados clásicos. Forro de cuero y plantilla anatómica extraíble.',
     'Zapatos Derby cuero marrón brillante',
     'ZAP-DER-027', 'Heritage Leather', 'ACTIVE', true, 2599.00, 2999.00, 18,
     ARRAY['derby', 'cuero', 'elegante'], '00000000-0000-0000-0000-000000000001');

-- 3h. Tenis (3 productos)
INSERT INTO products (id, category_id, name, slug, description, short_description, sku, brand, status, is_featured, base_price, compare_price, stock, tags, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000028',
     '10000000-0000-0000-0000-000000000031',
     'Tenis Blancos Clásicos',
     'tenis-blancos-clasicos',
     'Tenis blancos de corte clásico en lona y goma. Diseño atemporal que combina con todo. Suela vulcanizada antiderrapante. Cómodos y duraderos.',
     'Tenis blancos clásicos de lona',
     'TEN-BLA-028', 'Urban Comfort', 'ACTIVE', true, 1299.00, 1599.00, 40,
     ARRAY['tenis', 'blancos', 'clásicos'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000029',
     '10000000-0000-0000-0000-000000000031',
     'Tenis Deportivos ROJOS',
     'tenis-deportivos-rojos',
     'Tenis deportivos en rojo con tecnología de amortiguación Air+. Parte superior de malla transpirable. Ideal para running y entrenamiento.',
     'Tenis deportivos rojos con Air+',
     'TEN-DEP-029', 'Sportech', 'ACTIVE', false, 2299.00, 2799.00, 20,
     ARRAY['deportivos', 'running', 'amortiguación'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000030',
     '10000000-0000-0000-0000-000000000031',
     'Tenis Urbanos Grises',
     'tenis-urbanos-grises',
     'Tenis urbanos en gris con detalles en blanco. Diseño moderno con suela gruesa plateforme. Parte superior de gamuza y malla.',
     'Tenis urbanos gris plataforma',
     'TEN-URB-030', 'Urban Edge', 'ACTIVE', true, 1799.00, NULL, 30,
     ARRAY['urbanos', 'gris', 'plataforma'], '00000000-0000-0000-0000-000000000001');

-- 3i. Botas (3 productos)
INSERT INTO products (id, category_id, name, slug, description, short_description, sku, brand, status, is_featured, base_price, compare_price, stock, tags, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000031',
     '10000000-0000-0000-0000-000000000032',
     'Botas de Cuero Café',
     'botas-cuero-cafe',
     'Botas de cuero café con suela de goma dentada. Altura media con cremallera lateral para fácil calce. Forro térmico para clima frío.',
     'Botas de cuero café con forro térmico',
     'BOT-CUE-031', 'Trail Gear', 'ACTIVE', true, 3299.00, 3899.00, 12,
     ARRAY['botas', 'cuero', 'invierno'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000032',
     '10000000-0000-0000-0000-000000000032',
     'Botas de Lluvia Amarillas',
     'botas-lluvia-amarillas',
     'Botas de lluvia clásicas en amarillo. Goma 100% impermeable con suela antiderrapante. Altura media con agarradera trasera.',
     'Botas de lluvia amarillas impermeables',
     'BOT-LLU-032', 'Rain Shield', 'ACTIVE', false, 899.00, NULL, 25,
     ARRAY['lluvia', 'impermeable', 'amarillas'], '00000000-0000-0000-0000-000000000001'),

    ('20000000-0000-0000-0000-000000000033',
     '10000000-0000-0000-0000-000000000032',
     'Botín Negro Tacón',
     'botin-negro-tacon',
     'Botín negro de cuero con tacón de 5cm. Diseño moderno con punta ligeramente afilada. Cremallera interior. Perfecto para looks elegantes.',
     'Botín negro de cuero con tacón',
     'BOT-BOT-033', 'Urban Elegance', 'ACTIVE', true, 2499.00, 2999.00, 15,
     ARRAY['botín', 'tacón', 'elegante'], '00000000-0000-0000-0000-000000000001');

-- 4. IMÁGENES DE PRODUCTOS -------------------------------------

INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES
-- Camisa Blanca
    ('30000000-0001-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
     'https://ecommerce-maison-images-prod.s3.us-east-2.amazonaws.com/camisa-blanca.webp', 'Camisa blanca Classic Fit frente', 1, true),
    ('30000000-0001-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001',
     'https://picsum.photos/seed/camisa-blanca-2/600/800', 'Camisa blanca Classic Fit detalle', 2, false),
-- Camisa Azul Oxford
    ('30000000-0002-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
     'https://picsum.photos/seed/camisa-azul-1/600/800', 'Camisa azul Oxford frente', 1, true),
-- Camisa Lino Beige
    ('30000000-0003-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003',
     'https://picsum.photos/seed/camisa-lino-1/600/800', 'Camisa de lino beige frente', 1, true),
    ('30000000-0003-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003',
     'https://picsum.photos/seed/camisa-lino-2/600/800', 'Camisa de lino beige detalle', 2, false),
-- Camisa Negra
    ('30000000-0004-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004',
     'https://ecommerce-maison-images-prod.s3.us-east-2.amazonaws.com/camisa-negra.webp', 'Camisa negra slim fit frente', 1, true),
-- Camisa Cuadros
    ('30000000-0005-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005',
     'https://picsum.photos/seed/camisa-cuadros-1/600/800', 'Camisa casual cuadros frente', 1, true),
-- Pantalón Gris
    ('30000000-0006-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006',
     'https://picsum.photos/seed/pantalon-gris-1/600/800', 'Pantalón de vestir gris frente', 1, true),
-- Jeans Azul
    ('30000000-0007-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007',
     'https://picsum.photos/seed/jeans-azul-1/600/800', 'Jeans clásico azul frente', 1, true),
    ('30000000-0007-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007',
     'https://picsum.photos/seed/jeans-azul-2/600/800', 'Jeans clásico azul detalle', 2, false),
-- Chino Beige
    ('30000000-0008-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008',
     'https://picsum.photos/seed/chino-beige-1/600/800', 'Chino beige frente', 1, true),
-- Cargo Verde
    ('30000000-0009-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009',
     'https://picsum.photos/seed/cargo-verde-1/600/800', 'Pantalón cargo verde frente', 1, true),
-- Mezclilla Negra
    ('30000000-0010-0000-0000-000000000001', '20000000-0000-0000-0000-000000000010',
     'https://picsum.photos/seed/mezclilla-negra-1/600/800', 'Pantalón mezclilla negro frente', 1, true),
-- Chaqueta Cuero
    ('30000000-0011-0000-0000-000000000001', '20000000-0000-0000-0000-000000000011',
     'https://picsum.photos/seed/chaqueta-cuero-1/600/800', 'Chaqueta de cuero marrón frente', 1, true),
    ('30000000-0011-0000-0000-000000000002', '20000000-0000-0000-0000-000000000011',
     'https://picsum.photos/seed/chaqueta-cuero-2/600/800', 'Chaqueta de cuero marrón detalle', 2, false),
    ('30000000-0011-0000-0000-000000000003', '20000000-0000-0000-0000-000000000011',
     'https://picsum.photos/seed/chaqueta-cuero-3/600/800', 'Chaqueta de cuero marrón espalda', 3, false),
-- Chaqueta Impermeable
    ('30000000-0012-0000-0000-000000000001', '20000000-0000-0000-0000-000000000012',
     'https://picsum.photos/seed/chaqueta-impermeable-1/600/800', 'Chaqueta impermeable negra frente', 1, true),
-- Chamarra Beige
    ('30000000-0013-0000-0000-000000000001', '20000000-0000-0000-0000-000000000013',
     'https://picsum.photos/seed/chamarra-beige-1/600/800', 'Chamarra de algodón beige frente', 1, true),
    ('30000000-0013-0000-0000-000000000002', '20000000-0000-0000-0000-000000000013',
     'https://picsum.photos/seed/chamarra-beige-2/600/800', 'Chamarra de algodón beige detalle', 2, false),
-- Abrigo Lana
    ('30000000-0014-0000-0000-000000000001', '20000000-0000-0000-0000-000000000014',
     'https://picsum.photos/seed/abrigo-lana-1/600/800', 'Abrigo de lana gris frente', 1, true),
-- Chaqueta Deportiva
    ('30000000-0015-0000-0000-000000000001', '20000000-0000-0000-0000-000000000015',
     'https://picsum.photos/seed/chaqueta-deportiva-1/600/800', 'Chaqueta deportiva azul frente', 1, true),
-- Mochila
    ('30000000-0016-0000-0000-000000000001', '20000000-0000-0000-0000-000000000016',
     'https://picsum.photos/seed/mochila-negra-1/600/800', 'Mochila urbana negra frente', 1, true),
-- Bolso Tote
    ('30000000-0017-0000-0000-000000000001', '20000000-0000-0000-0000-000000000017',
     'https://picsum.photos/seed/bolso-tote-1/600/800', 'Bolso tote cuero frente', 1, true),
-- Riñonera
    ('30000000-0018-0000-0000-000000000001', '20000000-0000-0000-0000-000000000018',
     'https://picsum.photos/seed/rinonera-1/600/800', 'Riñonera verde frente', 1, true),
-- Reloj Clásico
    ('30000000-0019-0000-0000-000000000001', '20000000-0000-0000-0000-000000000019',
     'https://picsum.photos/seed/reloj-clasico-1/600/800', 'Reloj clásico dorado frente', 1, true),
-- Reloj Deportivo
    ('30000000-0020-0000-0000-000000000001', '20000000-0000-0000-0000-000000000020',
     'https://picsum.photos/seed/reloj-deportivo-1/600/800', 'Reloj deportivo negro frente', 1, true),
-- Reloj Minimalista
    ('30000000-0021-0000-0000-000000000001', '20000000-0000-0000-0000-000000000021',
     'https://picsum.photos/seed/reloj-minimalista-1/600/800', 'Reloj minimalista plateado frente', 1, true),
-- Collar
    ('30000000-0022-0000-0000-000000000001', '20000000-0000-0000-0000-000000000022',
     'https://picsum.photos/seed/collar-plata-1/600/800', 'Collar de plata con ónix frente', 1, true),
-- Pulsera
    ('30000000-0023-0000-0000-000000000001', '20000000-0000-0000-0000-000000000023',
     'https://picsum.photos/seed/pulsera-cuero-1/600/800', 'Pulsera de cuero y plata frente', 1, true),
-- Anillo
    ('30000000-0024-0000-0000-000000000001', '20000000-0000-0000-0000-000000000024',
     'https://picsum.photos/seed/anillo-oro-1/600/800', 'Anillo de oro 18k frente', 1, true),
-- Oxford
    ('30000000-0025-0000-0000-000000000001', '20000000-0000-0000-0000-000000000025',
     'https://picsum.photos/seed/oxford-negros-1/600/800', 'Zapatos Oxford negros frente', 1, true),
-- Mocasín
    ('30000000-0026-0000-0000-000000000001', '20000000-0000-0000-0000-000000000026',
     'https://picsum.photos/seed/mocasin-cafe-1/600/800', 'Mocasín café frente', 1, true),
-- Derby
    ('30000000-0027-0000-0000-000000000001', '20000000-0000-0000-0000-000000000027',
     'https://picsum.photos/seed/derby-marron-1/600/800', 'Zapatos Derby marrón frente', 1, true),
-- Tenis Blancos
    ('30000000-0028-0000-0000-000000000001', '20000000-0000-0000-0000-000000000028',
     'https://picsum.photos/seed/tenis-blancos-1/600/800', 'Tenis blancos clásicos frente', 1, true),
    ('30000000-0028-0000-0000-000000000002', '20000000-0000-0000-0000-000000000028',
     'https://picsum.photos/seed/tenis-blancos-2/600/800', 'Tenis blancos clásicos lateral', 2, false),
-- Tenis Rojos
    ('30000000-0029-0000-0000-000000000001', '20000000-0000-0000-0000-000000000029',
     'https://picsum.photos/seed/tenis-rojos-1/600/800', 'Tenis deportivos rojos frente', 1, true),
-- Tenis Grises
    ('30000000-0030-0000-0000-000000000001', '20000000-0000-0000-0000-000000000030',
     'https://picsum.photos/seed/tenis-grises-1/600/800', 'Tenis urbanos grises frente', 1, true),
-- Botas Cuero
    ('30000000-0031-0000-0000-000000000001', '20000000-0000-0000-0000-000000000031',
     'https://picsum.photos/seed/botas-cuero-1/600/800', 'Botas de cuero café frente', 1, true),
-- Botas Lluvia
    ('30000000-0032-0000-0000-000000000001', '20000000-0000-0000-0000-000000000032',
     'https://picsum.photos/seed/botas-lluvia-1/600/800', 'Botas de lluvia amarillas frente', 1, true),
-- Botín Tacón
    ('30000000-0033-0000-0000-000000000001', '20000000-0000-0000-0000-000000000033',
     'https://picsum.photos/seed/botin-negro-1/600/800', 'Botín negro tacón frente', 1, true);

-- 5. VARIANT OPTION TYPES Y VALORES (para productos con variantes) --

-- 5a. Opción Talla (para camisas y pantalones - IDs 1-10 y chaquetas 11-15)
INSERT INTO variant_option_types (id, product_id, name, sort_order)
VALUES

    ('40000000-0001-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Talla', 1),
    ('40000000-0002-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'Talla', 1),
    ('40000000-0003-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'Talla', 1),
    ('40000000-0004-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'Talla', 1),
    ('40000000-0005-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', 'Talla', 1),
    -- Talla para pantalones 6-10
    ('40000000-0006-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 'Talla', 1),
    ('40000000-0007-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', 'Talla', 1),
    ('40000000-0008-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', 'Talla', 1),
    ('40000000-0009-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009', 'Talla', 1),
    ('40000000-0010-0000-0000-000000000001', '20000000-0000-0000-0000-000000000010', 'Talla', 1),
    -- Color para Chaqueta Cuero (product 11) - colores
    ('40000000-0011-0000-0000-000000000001', '20000000-0000-0000-0000-000000000011', 'Color', 1),
    -- Talla para Chaqueta Impermeable (12), Chamarra (13), Deportiva (15)
    ('40000000-0012-0000-0000-000000000001', '20000000-0000-0000-0000-000000000012', 'Talla', 1),
    ('40000000-0013-0000-0000-000000000001', '20000000-0000-0000-0000-000000000013', 'Talla', 1),
    ('40000000-0015-0000-0000-000000000001', '20000000-0000-0000-0000-000000000015', 'Talla', 1),
    -- Color + Talla para Tenis Blancos (28)
    ('40000000-0028-0000-0000-000000000001', '20000000-0000-0000-0000-000000000028', 'Color', 1),
    ('40000000-0028-0000-0000-000000000002', '20000000-0000-0000-0000-000000000028', 'Talla', 2),
    -- Talla para Botas Cuero (31), Botín (33)
    ('40000000-0031-0000-0000-000000000001', '20000000-0000-0000-0000-000000000031', 'Talla', 1),
    ('40000000-0033-0000-0000-000000000001', '20000000-0000-0000-0000-000000000033', 'Talla', 1);

-- 5b. Valores de opciones
INSERT INTO variant_option_values (id, type_id, value, sort_order)
VALUES

    ('50000000-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000001', 'S', 1),
    ('50000000-0001-0000-0000-000000000002', '40000000-0001-0000-0000-000000000001', 'M', 2),
    ('50000000-0001-0000-0000-000000000003', '40000000-0001-0000-0000-000000000001', 'L', 3),
    ('50000000-0001-0000-0000-000000000004', '40000000-0001-0000-0000-000000000001', 'XL', 4),

    -- Tallas para camisa 2
    ('50000000-0002-0000-0000-000000000001', '40000000-0002-0000-0000-000000000001', 'S', 1),
    ('50000000-0002-0000-0000-000000000002', '40000000-0002-0000-0000-000000000001', 'M', 2),
    ('50000000-0002-0000-0000-000000000003', '40000000-0002-0000-0000-000000000001', 'L', 3),

    -- Tallas para camisa 3
    ('50000000-0003-0000-0000-000000000001', '40000000-0003-0000-0000-000000000001', 'S', 1),
    ('50000000-0003-0000-0000-000000000002', '40000000-0003-0000-0000-000000000001', 'M', 2),
    ('50000000-0003-0000-0000-000000000003', '40000000-0003-0000-0000-000000000001', 'L', 3),
    ('50000000-0003-0000-0000-000000000004', '40000000-0003-0000-0000-000000000001', 'XL', 4),

    -- Tallas para camisa 4 (S, M, L)
    ('50000000-0004-0000-0000-000000000001', '40000000-0004-0000-0000-000000000001', 'S', 1),
    ('50000000-0004-0000-0000-000000000002', '40000000-0004-0000-0000-000000000001', 'M', 2),
    ('50000000-0004-0000-0000-000000000003', '40000000-0004-0000-0000-000000000001', 'L', 3),

    -- Tallas para camisa 5 (M, L, XL)
    ('50000000-0005-0000-0000-000000000001', '40000000-0005-0000-0000-000000000001', 'M', 1),
    ('50000000-0005-0000-0000-000000000002', '40000000-0005-0000-0000-000000000001', 'L', 2),
    ('50000000-0005-0000-0000-000000000003', '40000000-0005-0000-0000-000000000001', 'XL', 3),

    -- Tallas para pantalón 6 (30, 32, 34, 36)
    ('50000000-0006-0000-0000-000000000001', '40000000-0006-0000-0000-000000000001', '30', 1),
    ('50000000-0006-0000-0000-000000000002', '40000000-0006-0000-0000-000000000001', '32', 2),
    ('50000000-0006-0000-0000-000000000003', '40000000-0006-0000-0000-000000000001', '34', 3),
    ('50000000-0006-0000-0000-000000000004', '40000000-0006-0000-0000-000000000001', '36', 4),

    -- Tallas para jeans 7 (30, 32, 34, 36)
    ('50000000-0007-0000-0000-000000000001', '40000000-0007-0000-0000-000000000001', '30', 1),
    ('50000000-0007-0000-0000-000000000002', '40000000-0007-0000-0000-000000000001', '32', 2),
    ('50000000-0007-0000-0000-000000000003', '40000000-0007-0000-0000-000000000001', '34', 3),

    -- Tallas para chino 8 (30, 32, 34, 36)
    ('50000000-0008-0000-0000-000000000001', '40000000-0008-0000-0000-000000000001', '30', 1),
    ('50000000-0008-0000-0000-000000000002', '40000000-0008-0000-0000-000000000001', '32', 2),
    ('50000000-0008-0000-0000-000000000003', '40000000-0008-0000-0000-000000000001', '34', 3),
    ('50000000-0008-0000-0000-000000000004', '40000000-0008-0000-0000-000000000001', '36', 4),

    -- Tallas para cargo 9 (S, M, L, XL)
    ('50000000-0009-0000-0000-000000000001', '40000000-0009-0000-0000-000000000001', 'S', 1),
    ('50000000-0009-0000-0000-000000000002', '40000000-0009-0000-0000-000000000001', 'M', 2),
    ('50000000-0009-0000-0000-000000000003', '40000000-0009-0000-0000-000000000001', 'L', 3),

    -- Tallas para mezclilla 10 (30, 32, 34)
    ('50000000-0010-0000-0000-000000000001', '40000000-0010-0000-0000-000000000001', '30', 1),
    ('50000000-0010-0000-0000-000000000002', '40000000-0010-0000-0000-000000000001', '32', 2),
    ('50000000-0010-0000-0000-000000000003', '40000000-0010-0000-0000-000000000001', '34', 3),

    -- Colores para chaqueta cuero 11
    ('50000000-0011-0000-0000-000000000001', '40000000-0011-0000-0000-000000000001', 'Marrón', 1),
    ('50000000-0011-0000-0000-000000000002', '40000000-0011-0000-0000-000000000001', 'Negro', 2),

    -- Tallas para chaqueta impermeable 12 (S, M, L, XL)
    ('50000000-0012-0000-0000-000000000001', '40000000-0012-0000-0000-000000000001', 'S', 1),
    ('50000000-0012-0000-0000-000000000002', '40000000-0012-0000-0000-000000000001', 'M', 2),
    ('50000000-0012-0000-0000-000000000003', '40000000-0012-0000-0000-000000000001', 'L', 3),
    ('50000000-0012-0000-0000-000000000004', '40000000-0012-0000-0000-000000000001', 'XL', 4),

    -- Tallas para chamarra 13 (S, M, L)
    ('50000000-0013-0000-0000-000000000001', '40000000-0013-0000-0000-000000000001', 'S', 1),
    ('50000000-0013-0000-0000-000000000002', '40000000-0013-0000-0000-000000000001', 'M', 2),
    ('50000000-0013-0000-0000-000000000003', '40000000-0013-0000-0000-000000000001', 'L', 3),

    -- Tallas para chaqueta deportiva 15 (S, M, L, XL)
    ('50000000-0015-0000-0000-000000000001', '40000000-0015-0000-0000-000000000001', 'S', 1),
    ('50000000-0015-0000-0000-000000000002', '40000000-0015-0000-0000-000000000001', 'M', 2),
    ('50000000-0015-0000-0000-000000000003', '40000000-0015-0000-0000-000000000001', 'L', 3),
    ('50000000-0015-0000-0000-000000000004', '40000000-0015-0000-0000-000000000001', 'XL', 4),

    -- Color para tenis blancos 28
    ('50000000-0028-0000-0000-000000000001', '40000000-0028-0000-0000-000000000001', 'Blanco', 1),
    ('50000000-0028-0000-0000-000000000002', '40000000-0028-0000-0000-000000000001', 'Negro', 2),

    -- Tallas para tenis 28 (7, 8, 9, 10, 11)
    ('50000000-0028-0000-0000-000000000003', '40000000-0028-0000-0000-000000000002', '7', 1),
    ('50000000-0028-0000-0000-000000000004', '40000000-0028-0000-0000-000000000002', '8', 2),
    ('50000000-0028-0000-0000-000000000005', '40000000-0028-0000-0000-000000000002', '9', 3),
    ('50000000-0028-0000-0000-000000000006', '40000000-0028-0000-0000-000000000002', '10', 4),
    ('50000000-0028-0000-0000-000000000007', '40000000-0028-0000-0000-000000000002', '11', 5),

    -- Tallas para botas cuero 31 (7, 8, 9, 10)
    ('50000000-0031-0000-0000-000000000001', '40000000-0031-0000-0000-000000000001', '7', 1),
    ('50000000-0031-0000-0000-000000000002', '40000000-0031-0000-0000-000000000001', '8', 2),
    ('50000000-0031-0000-0000-000000000003', '40000000-0031-0000-0000-000000000001', '9', 3),
    ('50000000-0031-0000-0000-000000000004', '40000000-0031-0000-0000-000000000001', '10', 4),

    -- Tallas para botín 33 (5, 6, 7, 8)
    ('50000000-0033-0000-0000-000000000001', '40000000-0033-0000-0000-000000000001', '5', 1),
    ('50000000-0033-0000-0000-000000000002', '40000000-0033-0000-0000-000000000001', '6', 2),
    ('50000000-0033-0000-0000-000000000003', '40000000-0033-0000-0000-000000000001', '7', 3),
    ('50000000-0033-0000-0000-000000000004', '40000000-0033-0000-0000-000000000001', '8', 4);

-- 6. VARIANTES DE PRODUCTO --------------------------------------

-- Helper: variants for camisas 1-5 (tallas S/M/L/XL)
-- Camisa 1 (4 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0001-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'CAM-BLA-001-S', 'Camisa Blanca S', 899.00, 10, true, 1),
    ('60000000-0001-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'CAM-BLA-001-M', 'Camisa Blanca M', 899.00, 15, true, 2),
    ('60000000-0001-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'CAM-BLA-001-L', 'Camisa Blanca L', 899.00, 18, true, 3),
    ('60000000-0001-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 'CAM-BLA-001-XL', 'Camisa Blanca XL', 949.00, 7, true, 4);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0001-0000-0000-000000000001', '50000000-0001-0000-0000-000000000001'),
    ('60000000-0001-0000-0000-000000000002', '50000000-0001-0000-0000-000000000002'),
    ('60000000-0001-0000-0000-000000000003', '50000000-0001-0000-0000-000000000003'),
    ('60000000-0001-0000-0000-000000000004', '50000000-0001-0000-0000-000000000004');

-- Camisa 2 (3 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0002-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'CAM-AZU-002-S', 'Camisa Azul S', 749.00, 5, true, 1),
    ('60000000-0002-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'CAM-AZU-002-M', 'Camisa Azul M', 749.00, 12, true, 2),
    ('60000000-0002-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'CAM-AZU-002-L', 'Camisa Azul L', 749.00, 18, true, 3);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0002-0000-0000-000000000001', '50000000-0002-0000-0000-000000000001'),
    ('60000000-0002-0000-0000-000000000002', '50000000-0002-0000-0000-000000000002'),
    ('60000000-0002-0000-0000-000000000003', '50000000-0002-0000-0000-000000000003');

-- Camisa 3 (4 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0003-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'CAM-LIN-003-S', 'Camisa Lino S', 1099.00, 3, true, 1),
    ('60000000-0003-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 'CAM-LIN-003-M', 'Camisa Lino M', 1099.00, 8, true, 2),
    ('60000000-0003-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'CAM-LIN-003-L', 'Camisa Lino L', 1099.00, 7, true, 3),
    ('60000000-0003-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', 'CAM-LIN-003-XL', 'Camisa Lino XL', 1149.00, 2, true, 4);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0003-0000-0000-000000000001', '50000000-0003-0000-0000-000000000001'),
    ('60000000-0003-0000-0000-000000000002', '50000000-0003-0000-0000-000000000002'),
    ('60000000-0003-0000-0000-000000000003', '50000000-0003-0000-0000-000000000003'),
    ('60000000-0003-0000-0000-000000000004', '50000000-0003-0000-0000-000000000004');

-- Camisa 4 (3 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0004-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'CAM-NEG-004-S', 'Camisa Negra S', 949.00, 8, true, 1),
    ('60000000-0004-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 'CAM-NEG-004-M', 'Camisa Negra M', 949.00, 20, true, 2),
    ('60000000-0004-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'CAM-NEG-004-L', 'Camisa Negra L', 949.00, 12, true, 3);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0004-0000-0000-000000000001', '50000000-0004-0000-0000-000000000001'),
    ('60000000-0004-0000-0000-000000000002', '50000000-0004-0000-0000-000000000002'),
    ('60000000-0004-0000-0000-000000000003', '50000000-0004-0000-0000-000000000003');

-- Camisa 5 (3 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0005-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', 'CAM-CUA-005-M', 'Camisa Cuadros M', 649.00, 10, true, 1),
    ('60000000-0005-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', 'CAM-CUA-005-L', 'Camisa Cuadros L', 649.00, 12, true, 2),
    ('60000000-0005-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', 'CAM-CUA-005-XL', 'Camisa Cuadros XL', 649.00, 3, true, 3);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0005-0000-0000-000000000001', '50000000-0005-0000-0000-000000000001'),
    ('60000000-0005-0000-0000-000000000002', '50000000-0005-0000-0000-000000000002'),
    ('60000000-0005-0000-0000-000000000003', '50000000-0005-0000-0000-000000000003');

-- Pantalón 6 (4 tallas: 30, 32, 34, 36)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0006-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 'PAN-GRI-006-30', 'Pantalón Gris 30', 1299.00, 5, true, 1),
    ('60000000-0006-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', 'PAN-GRI-006-32', 'Pantalón Gris 32', 1299.00, 10, true, 2),
    ('60000000-0006-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', 'PAN-GRI-006-34', 'Pantalón Gris 34', 1299.00, 12, true, 3),
    ('60000000-0006-0000-0000-000000000004', '20000000-0000-0000-0000-000000000006', 'PAN-GRI-006-36', 'Pantalón Gris 36', 1299.00, 3, true, 4);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0006-0000-0000-000000000001', '50000000-0006-0000-0000-000000000001'),
    ('60000000-0006-0000-0000-000000000002', '50000000-0006-0000-0000-000000000002'),
    ('60000000-0006-0000-0000-000000000003', '50000000-0006-0000-0000-000000000003'),
    ('60000000-0006-0000-0000-000000000004', '50000000-0006-0000-0000-000000000004');

-- Jeans 7 (3 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0007-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', 'PAN-JEA-007-30', 'Jeans Azul 30', 999.00, 15, true, 1),
    ('60000000-0007-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', 'PAN-JEA-007-32', 'Jeans Azul 32', 999.00, 25, true, 2),
    ('60000000-0007-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', 'PAN-JEA-007-34', 'Jeans Azul 34', 999.00, 20, true, 3);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0007-0000-0000-000000000001', '50000000-0007-0000-0000-000000000001'),
    ('60000000-0007-0000-0000-000000000002', '50000000-0007-0000-0000-000000000002'),
    ('60000000-0007-0000-0000-000000000003', '50000000-0007-0000-0000-000000000003');

-- Chino 8 (4 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0008-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', 'PAN-CHI-008-30', 'Chino Beige 30', 849.00, 8, true, 1),
    ('60000000-0008-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', 'PAN-CHI-008-32', 'Chino Beige 32', 849.00, 15, true, 2),
    ('60000000-0008-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', 'PAN-CHI-008-34', 'Chino Beige 34', 849.00, 12, true, 3),
    ('60000000-0008-0000-0000-000000000004', '20000000-0000-0000-0000-000000000008', 'PAN-CHI-008-36', 'Chino Beige 36', 849.00, 10, true, 4);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0008-0000-0000-000000000001', '50000000-0008-0000-0000-000000000001'),
    ('60000000-0008-0000-0000-000000000002', '50000000-0008-0000-0000-000000000002'),
    ('60000000-0008-0000-0000-000000000003', '50000000-0008-0000-0000-000000000003'),
    ('60000000-0008-0000-0000-000000000004', '50000000-0008-0000-0000-000000000004');

-- Cargo 9 (3 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0009-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009', 'PAN-CAR-009-S', 'Cargo Verde S', 799.00, 4, true, 1),
    ('60000000-0009-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', 'PAN-CAR-009-M', 'Cargo Verde M', 799.00, 6, true, 2),
    ('60000000-0009-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', 'PAN-CAR-009-L', 'Cargo Verde L', 799.00, 5, true, 3);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0009-0000-0000-000000000001', '50000000-0009-0000-0000-000000000001'),
    ('60000000-0009-0000-0000-000000000002', '50000000-0009-0000-0000-000000000002'),
    ('60000000-0009-0000-0000-000000000003', '50000000-0009-0000-0000-000000000003');

-- Mezclilla 10 (3 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0010-0000-0000-000000000001', '20000000-0000-0000-0000-000000000010', 'PAN-MEZ-010-30', 'Mezclilla Negra 30', 1049.00, 10, true, 1),
    ('60000000-0010-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010', 'PAN-MEZ-010-32', 'Mezclilla Negra 32', 1049.00, 15, true, 2),
    ('60000000-0010-0000-0000-000000000003', '20000000-0000-0000-0000-000000000010', 'PAN-MEZ-010-34', 'Mezclilla Negra 34', 1049.00, 10, true, 3);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0010-0000-0000-000000000001', '50000000-0010-0000-0000-000000000001'),
    ('60000000-0010-0000-0000-000000000002', '50000000-0010-0000-0000-000000000002'),
    ('60000000-0010-0000-0000-000000000003', '50000000-0010-0000-0000-000000000003');

-- Chaqueta Cuero 11 (2 colores)
INSERT INTO product_variants (id, product_id, sku, name, price, compare_price, stock, is_active, sort_order)
VALUES
    ('60000000-0011-0000-0000-000000000001', '20000000-0000-0000-0000-000000000011', 'CHA-CUE-011-M', 'Chaqueta Cuero Marrón', 3499.00, 4299.00, 5, true, 1),
    ('60000000-0011-0000-0000-000000000002', '20000000-0000-0000-0000-000000000011', 'CHA-CUE-011-N', 'Chaqueta Cuero Negro', 3699.00, 4299.00, 5, true, 2);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0011-0000-0000-000000000001', '50000000-0011-0000-0000-000000000001'),
    ('60000000-0011-0000-0000-000000000002', '50000000-0011-0000-0000-000000000002');

-- Chaqueta Impermeable 12 (4 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0012-0000-0000-000000000001', '20000000-0000-0000-0000-000000000012', 'CHA-IMP-012-S', 'Chaqueta Impermeable S', 2199.00, 3, true, 1),
    ('60000000-0012-0000-0000-000000000002', '20000000-0000-0000-0000-000000000012', 'CHA-IMP-012-M', 'Chaqueta Impermeable M', 2199.00, 7, true, 2),
    ('60000000-0012-0000-0000-000000000003', '20000000-0000-0000-0000-000000000012', 'CHA-IMP-012-L', 'Chaqueta Impermeable L', 2199.00, 8, true, 3),
    ('60000000-0012-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', 'CHA-IMP-012-XL', 'Chaqueta Impermeable XL', 2199.00, 2, true, 4);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0012-0000-0000-000000000001', '50000000-0012-0000-0000-000000000001'),
    ('60000000-0012-0000-0000-000000000002', '50000000-0012-0000-0000-000000000002'),
    ('60000000-0012-0000-0000-000000000003', '50000000-0012-0000-0000-000000000003'),
    ('60000000-0012-0000-0000-000000000004', '50000000-0012-0000-0000-000000000004');

-- Chamarra 13 (3 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0013-0000-0000-000000000001', '20000000-0000-0000-0000-000000000013', 'CHA-ALG-013-S', 'Chamarra Beige S', 1499.00, 6, true, 1),
    ('60000000-0013-0000-0000-000000000002', '20000000-0000-0000-0000-000000000013', 'CHA-ALG-013-M', 'Chamarra Beige M', 1499.00, 10, true, 2),
    ('60000000-0013-0000-0000-000000000003', '20000000-0000-0000-0000-000000000013', 'CHA-ALG-013-L', 'Chamarra Beige L', 1499.00, 9, true, 3);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0013-0000-0000-000000000001', '50000000-0013-0000-0000-000000000001'),
    ('60000000-0013-0000-0000-000000000002', '50000000-0013-0000-0000-000000000002'),
    ('60000000-0013-0000-0000-000000000003', '50000000-0013-0000-0000-000000000003');

-- Chaqueta Deportiva 15 (4 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0015-0000-0000-000000000001', '20000000-0000-0000-0000-000000000015', 'CHA-DEP-015-S', 'Chaqueta Deportiva S', 999.00, 8, true, 1),
    ('60000000-0015-0000-0000-000000000002', '20000000-0000-0000-0000-000000000015', 'CHA-DEP-015-M', 'Chaqueta Deportiva M', 999.00, 12, true, 2),
    ('60000000-0015-0000-0000-000000000003', '20000000-0000-0000-0000-000000000015', 'CHA-DEP-015-L', 'Chaqueta Deportiva L', 999.00, 8, true, 3),
    ('60000000-0015-0000-0000-000000000004', '20000000-0000-0000-0000-000000000015', 'CHA-DEP-015-XL', 'Chaqueta Deportiva XL', 999.00, 2, true, 4);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0015-0000-0000-000000000001', '50000000-0015-0000-0000-000000000001'),
    ('60000000-0015-0000-0000-000000000002', '50000000-0015-0000-0000-000000000002'),
    ('60000000-0015-0000-0000-000000000003', '50000000-0015-0000-0000-000000000003'),
    ('60000000-0015-0000-0000-000000000004', '50000000-0015-0000-0000-000000000004');

-- Tenis Blancos 28 (Color + Talla combinados - ejemplos representativos)
INSERT INTO product_variants (id, product_id, sku, name, price, compare_price, stock, is_active, sort_order)
VALUES
    ('60000000-0028-0000-0000-000000000001', '20000000-0000-0000-0000-000000000028', 'TEN-BLA-028-B7', 'Tenis Blanco 7', 1299.00, 1599.00, 5, true, 1),
    ('60000000-0028-0000-0000-000000000002', '20000000-0000-0000-0000-000000000028', 'TEN-BLA-028-B8', 'Tenis Blanco 8', 1299.00, 1599.00, 8, true, 2),
    ('60000000-0028-0000-0000-000000000003', '20000000-0000-0000-0000-000000000028', 'TEN-BLA-028-B9', 'Tenis Blanco 9', 1299.00, 1599.00, 12, true, 3),
    ('60000000-0028-0000-0000-000000000004', '20000000-0000-0000-0000-000000000028', 'TEN-BLA-028-B10', 'Tenis Blanco 10', 1299.00, 1599.00, 10, true, 4),
    ('60000000-0028-0000-0000-000000000005', '20000000-0000-0000-0000-000000000028', 'TEN-BLA-028-N9', 'Tenis Negro 9', 1299.00, 1599.00, 5, true, 5);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES

    ('60000000-0028-0000-0000-000000000001', '50000000-0028-0000-0000-000000000001'),
    ('60000000-0028-0000-0000-000000000001', '50000000-0028-0000-0000-000000000003'),
    -- Blanco 8
    ('60000000-0028-0000-0000-000000000002', '50000000-0028-0000-0000-000000000001'),
    ('60000000-0028-0000-0000-000000000002', '50000000-0028-0000-0000-000000000004'),
    -- Blanco 9
    ('60000000-0028-0000-0000-000000000003', '50000000-0028-0000-0000-000000000001'),
    ('60000000-0028-0000-0000-000000000003', '50000000-0028-0000-0000-000000000005'),
    -- Blanco 10
    ('60000000-0028-0000-0000-000000000004', '50000000-0028-0000-0000-000000000001'),
    ('60000000-0028-0000-0000-000000000004', '50000000-0028-0000-0000-000000000006'),
    -- Negro 9
    ('60000000-0028-0000-0000-000000000005', '50000000-0028-0000-0000-000000000002'),
    ('60000000-0028-0000-0000-000000000005', '50000000-0028-0000-0000-000000000005');

-- Botas Cuero 31 (4 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0031-0000-0000-000000000001', '20000000-0000-0000-0000-000000000031', 'BOT-CUE-031-7', 'Botas Cuero 7', 3299.00, 3, true, 1),
    ('60000000-0031-0000-0000-000000000002', '20000000-0000-0000-0000-000000000031', 'BOT-CUE-031-8', 'Botas Cuero 8', 3299.00, 4, true, 2),
    ('60000000-0031-0000-0000-000000000003', '20000000-0000-0000-0000-000000000031', 'BOT-CUE-031-9', 'Botas Cuero 9', 3299.00, 3, true, 3),
    ('60000000-0031-0000-0000-000000000004', '20000000-0000-0000-0000-000000000031', 'BOT-CUE-031-10', 'Botas Cuero 10', 3299.00, 2, true, 4);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0031-0000-0000-000000000001', '50000000-0031-0000-0000-000000000001'),
    ('60000000-0031-0000-0000-000000000002', '50000000-0031-0000-0000-000000000002'),
    ('60000000-0031-0000-0000-000000000003', '50000000-0031-0000-0000-000000000003'),
    ('60000000-0031-0000-0000-000000000004', '50000000-0031-0000-0000-000000000004');

-- Botín 33 (4 tallas)
INSERT INTO product_variants (id, product_id, sku, name, price, stock, is_active, sort_order)
VALUES
    ('60000000-0033-0000-0000-000000000001', '20000000-0000-0000-0000-000000000033', 'BOT-BOT-033-5', 'Botín Tacón 5', 2499.00, 4, true, 1),
    ('60000000-0033-0000-0000-000000000002', '20000000-0000-0000-0000-000000000033', 'BOT-BOT-033-6', 'Botín Tacón 6', 2499.00, 6, true, 2),
    ('60000000-0033-0000-0000-000000000003', '20000000-0000-0000-0000-000000000033', 'BOT-BOT-033-7', 'Botín Tacón 7', 2499.00, 3, true, 3),
    ('60000000-0033-0000-0000-000000000004', '20000000-0000-0000-0000-000000000033', 'BOT-BOT-033-8', 'Botín Tacón 8', 2499.00, 2, true, 4);

INSERT INTO variant_option_assignments (variant_id, value_id)
VALUES
    ('60000000-0033-0000-0000-000000000001', '50000000-0033-0000-0000-000000000001'),
    ('60000000-0033-0000-0000-000000000002', '50000000-0033-0000-0000-000000000002'),
    ('60000000-0033-0000-0000-000000000003', '50000000-0033-0000-0000-000000000003'),
    ('60000000-0033-0000-0000-000000000004', '50000000-0033-0000-0000-000000000004');

-- 7. CARRITO DE PRUEBA (para user@test.com) --------------------

INSERT INTO carts (id, user_id, status)
VALUES ('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'ACTIVE');

INSERT INTO cart_items (id, cart_id, variant_id, quantity, unit_price)
VALUES
    ('71000000-0001-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001',
     '60000000-0002-0000-0000-000000000002', 2, 749.00),
    ('71000000-0002-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001',
     '60000000-0007-0000-0000-000000000002', 1, 999.00),
    ('71000000-0003-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001',
     '60000000-0028-0000-0000-000000000003', 1, 1299.00);

-- 8. WISHLIST DE PRUEBA (para user@test.com) --------------------

INSERT INTO wishlists (id, user_id, product_id)
VALUES
    ('80000000-0001-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002',
     '20000000-0000-0000-0000-000000000011'),
    ('80000000-0002-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002',
     '20000000-0000-0000-0000-000000000019'),
    ('80000000-0003-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002',
     '20000000-0000-0000-0000-000000000024');
