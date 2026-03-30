"""
Model exported as python.
Name : Temps_de_trajet_vers_hopitaux
Group : 
With QGIS : 33407
"""

from qgis.core import *
import processing


class Temps_de_trajet_vers_hopitaux(QgsProcessingAlgorithm):

    def initAlgorithm(self, config=None):
        self.addParameter(QgsProcessingParameterPoint('depart', 'depart', defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('reseau_routier', 'reseau_routier', types=[QgsProcessing.TypeVectorLine], defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('hopitaux', 'hopitaux', types=[QgsProcessing.TypeVectorPoint], defaultValue=None))
        self.addParameter(QgsProcessingParameterFeatureSink('Chemin_le_plus_rapide_pour_chaque_hopital_avec_le_temps_de_trajet_en_minutes', 'Chemin_le_plus_rapide_pour_chaque_hopital_avec_le_temps_de_trajet_en_minutes', type=QgsProcessing.TypeVectorAnyGeometry, createByDefault=True, supportsAppend=True, defaultValue=None))
        self.addParameter(QgsProcessingParameterFeatureSink('Trajet_le_plus_rapide_depuis_mon_point_de_depart', 'Trajet_le_plus_rapide_depuis_mon_point_de_depart', type=QgsProcessing.TypeVectorAnyGeometry, createByDefault=True, defaultValue='TEMPORARY_OUTPUT'))

    def processAlgorithm(self, parameters, context, model_feedback):
        # Use a multi-step feedback, so that individual child algorithm progress reports are adjusted for the
        # overall progress through the model
        feedback = QgsProcessingMultiStepFeedback(8, model_feedback)
        results = {}
        outputs = {}

        # Index_spatial_reseau_routier
        alg_params = {
            'INPUT': parameters['reseau_routier']
        }
        outputs['Index_spatial_reseau_routier'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(1)
        if feedback.isCanceled():
            return {}

        # Index_spatial_hopitaux
        alg_params = {
            'INPUT': parameters['hopitaux']
        }
        outputs['Index_spatial_hopitaux'] = processing.run('native:createspatialindex', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(2)
        if feedback.isCanceled():
            return {}

        # Itineraire_le_plus_rapide_du_point_de_depart_vers_chacun_des_hopitaux
        alg_params = {
            'DEFAULT_DIRECTION': 2,  # Les 2 directions
            'DEFAULT_SPEED': 80,
            'DIRECTION_FIELD': '',
            'END_POINTS': outputs['Index_spatial_hopitaux']['OUTPUT'],
            'INPUT': outputs['Index_spatial_reseau_routier']['OUTPUT'],
            'SPEED_FIELD': '',
            'START_POINT': parameters['depart'],
            'STRATEGY': 1,  # Le plus rapide
            'TOLERANCE': 0,
            'VALUE_BACKWARD': '',
            'VALUE_BOTH': '',
            'VALUE_FORWARD': '',
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['Itineraire_le_plus_rapide_du_point_de_depart_vers_chacun_des_hopitaux'] = processing.run('native:shortestpathpointtolayer', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(3)
        if feedback.isCanceled():
            return {}

        # Temps_de_trajet_en_minutes
        alg_params = {
            'FIELD_LENGTH': 15,
            'FIELD_NAME': 'temps_minutes',
            'FIELD_PRECISION': 4,
            'FIELD_TYPE': 0,  # Decimal (double)
            'FORMULA': 'round($length / (80 * 1000), 4)*60',  # Conversion en minutes avec arrondi
            'INPUT': outputs['Itineraire_le_plus_rapide_du_point_de_depart_vers_chacun_des_hopitaux']['OUTPUT'],
            'OUTPUT': parameters['Chemin_le_plus_rapide_pour_chaque_hopital_avec_le_temps_de_trajet_en_minutes']
        }
        outputs['Temps_de_trajet_en_minutes'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        results['Chemin_le_plus_rapide_pour_chaque_hopital_avec_le_temps_de_trajet_en_minutes'] = outputs['Temps_de_trajet_en_minutes']['OUTPUT']

        feedback.setCurrentStep(4)
        if feedback.isCanceled():
            return {}

        # trier_les_trajets_par_ordre_croissant_(du_plus_rapide_au_moins_rapide)
        alg_params = {
            'ASCENDING': True,
            'EXPRESSION': 'to_real("temps_minutes")',  # Conversion explicite en nombre réel
            'INPUT': outputs['Temps_de_trajet_en_minutes']['OUTPUT'],
            'NULLS_FIRST': False,
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['Trier_les_trajets_par_ordre_croissant_du_plus_rapide_au_moins_rapide'] = processing.run('native:orderbyexpression', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(5)
        if feedback.isCanceled():
            return {}

        
        # Rang_des_hopitaux_selon_son_acces_en_minutes
        alg_params = {
            'FIELD_LENGTH': 5,
            'FIELD_NAME': 'Classement',
            'FIELD_PRECISION': 0,
            'FIELD_TYPE': 1,  # Entier (32bit)
            'FORMULA': '@row_number',
            'INPUT': outputs['Trier_les_trajets_par_ordre_croissant_du_plus_rapide_au_moins_rapide']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['Rang_des_hopitaux_selon_son_acces_en_minutes'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(6)
        if feedback.isCanceled():
            return {}

        # Selectionner_le_trajet le_plus_rapide
        alg_params = {
            'FIELD': 'Classement',
            'INPUT': outputs['Rang_des_hopitaux_selon_son_acces_en_minutes']['OUTPUT'],
            'METHOD': 0,  # Creer une nouvelle selection
            'OPERATOR': 0,  # =
            'VALUE': QgsExpression('1').evaluate()
        }
        outputs['Selectionner_le_trajet_Le_plus_rapide'] = processing.run('qgis:selectbyattribute', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(7)
        if feedback.isCanceled():
            return {}

        # Extraire_le_trajet_le_plus_rapide_depuis_mon_point_de_depart
        alg_params = {
            'INPUT': outputs['Selectionner_le_trajet_Le_plus_rapide']['OUTPUT'],
            'OUTPUT': parameters['Trajet_le_plus_rapide_depuis_mon_point_de_depart']
        }
        outputs['Extraire_le_trajet_le_plus_rapide_depuis_mon_point_de_depart'] = processing.run('native:saveselectedfeatures', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        results['Trajet_le_plus_rapide_depuis_mon_point_de_depart'] = outputs['Extraire_le_trajet_le_plus_rapide_depuis_mon_point_de_depart']['OUTPUT']
        return results


    def name(self):
        return 'Temps_de_trajet_vers_hopitaux'

    def displayName(self):
        return 'Temps_de_trajet_vers_hopitaux'

    def group(self):
        return ''

    def groupId(self):
        return ''

    def createInstance(self):
        return Temps_de_trajet_vers_hopitaux()