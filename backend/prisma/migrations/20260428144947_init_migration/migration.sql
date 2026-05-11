-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `username` VARCHAR(32) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `role` ENUM('ADMIN', 'TRIADOR', 'MEDICO') NOT NULL DEFAULT 'TRIADOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `year` VARCHAR(10) NULL,
    `school_fk` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classroom_fk` INTEGER NOT NULL,
    `school_fk` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `birthday` VARCHAR(10) NOT NULL,
    `cpf` VARCHAR(14) NULL,
    `sex` SMALLINT NOT NULL,
    `color_race` SMALLINT NOT NULL,
    `zone` SMALLINT NOT NULL,
    `deficiency` BOOLEAN NOT NULL DEFAULT false,
    `turno` VARCHAR(20) NULL,
    `permission` BOOLEAN NOT NULL DEFAULT false,
    `filho_oculos` VARCHAR(1) NULL,
    `horas_uso_aparelhos_eletronicos` SMALLINT NULL,
    `horas_atividades_ao_ar_livre` SMALLINT NULL,
    `dificuldade_quadro` BOOLEAN NOT NULL DEFAULT false,
    `dificuldade_livro` BOOLEAN NOT NULL DEFAULT false,
    `olho_torto_constante` BOOLEAN NOT NULL DEFAULT false,
    `olho_torto_momentos` BOOLEAN NOT NULL DEFAULT false,
    `rosto_aperta_olhos` BOOLEAN NOT NULL DEFAULT false,
    `tremor_olhos` BOOLEAN NOT NULL DEFAULT false,
    `mancha_branca_pupila` BOOLEAN NOT NULL DEFAULT false,
    `olho_preguicoso` BOOLEAN NOT NULL DEFAULT false,
    `olho_torto_doenca` BOOLEAN NOT NULL DEFAULT false,
    `catarata_infancia` BOOLEAN NOT NULL DEFAULT false,
    `glaucoma_congenito` BOOLEAN NOT NULL DEFAULT false,
    `tumor_olhos` BOOLEAN NOT NULL DEFAULT false,
    `ceratocone_transplante` BOOLEAN NOT NULL DEFAULT false,
    `palpebra_caida` BOOLEAN NOT NULL DEFAULT false,
    `miopia_ambos_pais` BOOLEAN NOT NULL DEFAULT false,
    `miopia_um_pai` BOOLEAN NOT NULL DEFAULT false,
    `hipermetropia_astigmatismo` BOOLEAN NOT NULL DEFAULT false,
    `estrabismo` BOOLEAN NOT NULL DEFAULT false,
    `catarata_glaucoma` BOOLEAN NOT NULL DEFAULT false,
    `olho_preguicoso_familiar` BOOLEAN NOT NULL DEFAULT false,
    `tumor_olho_familiar` BOOLEAN NOT NULL DEFAULT false,
    `prematuridade` BOOLEAN NOT NULL DEFAULT false,
    `sindrome_down` BOOLEAN NOT NULL DEFAULT false,
    `paralisia_tumor_cerebral` BOOLEAN NOT NULL DEFAULT false,
    `outras_sindromes_geneticas` BOOLEAN NOT NULL DEFAULT false,
    `diabetes` BOOLEAN NOT NULL DEFAULT false,
    `artrite_artrose` BOOLEAN NOT NULL DEFAULT false,
    `alergias_corticoides` BOOLEAN NOT NULL DEFAULT false,
    `acuidade_triagem_direito` VARCHAR(10) NULL,
    `acuidade_triagem_esquerdo` VARCHAR(10) NULL,
    `test_cover` VARCHAR(1) NULL,
    `test_movimento_ocular` VARCHAR(1) NULL,
    `test_mancha_branca` VARCHAR(1) NULL,
    `receita_esferico_od` VARCHAR(20) NULL,
    `receita_cilindrico_od` VARCHAR(20) NULL,
    `receita_eixo_od` VARCHAR(20) NULL,
    `receita_esferico_oe` VARCHAR(20) NULL,
    `receita_cilindrico_oe` VARCHAR(20) NULL,
    `receita_eixo_oe` VARCHAR(20) NULL,
    `receita_adicao` VARCHAR(20) NULL,
    `receita_dp` VARCHAR(20) NULL,
    `data_consulta` VARCHAR(20) NULL,
    `crm_medico` VARCHAR(50) NULL,
    `nome_medico` VARCHAR(200) NULL,
    `points` DOUBLE NOT NULL DEFAULT 0,
    `questionario_pais_completed` BOOLEAN NOT NULL DEFAULT false,
    `triagem_completed` BOOLEAN NOT NULL DEFAULT false,
    `receita_oculos_completed` BOOLEAN NOT NULL DEFAULT false,
    `consulta_completed` BOOLEAN NOT NULL DEFAULT false,
    `entrega_oculos_completed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `classroom` ADD CONSTRAINT `classroom_school_fk_fkey` FOREIGN KEY (`school_fk`) REFERENCES `school`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_data` ADD CONSTRAINT `student_data_classroom_fk_fkey` FOREIGN KEY (`classroom_fk`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_data` ADD CONSTRAINT `student_data_school_fk_fkey` FOREIGN KEY (`school_fk`) REFERENCES `school`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
