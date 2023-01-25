import emission.core.get_database as edb

CURR_EBIKE_LABELS = ["pilot_ebike"]

def inferred_ebike_ids(label_prediction_entries):
    object_ids = []
    oid_per_lpe = []
    print(f"Finding inferred bike ids from {len(label_prediction_entries)} trips")
    total_label_opt_count = 0
    for idx, lpe in label_prediction_entries:
        # print(lpe)
        total_label_opt_count = total_label_opt_count + len(lpe)
        curr_lpe_oids = []
        for label_opt in lpe:
            # print(label_opt)
            if "mode_confirm" in label_opt["labels"] and label_opt["labels"]["mode_confirm"] in CURR_EBIKE_LABELS:
                # print(lpe)
                curr_lpe_oids.append(idx)
                object_ids.append(idx)
        oid_per_lpe.append(len(curr_lpe_oids))
    # print(object_ids)
    # print(f"Total label opt = {total_label_opt_count}")
    # print(f"OID per LPE = {[c for c in oid_per_lpe if c != 0]}")
    return object_ids

print("_" * 10, "label predictions", "_" * 10)
label_predictions_list = inferred_ebike_ids([(e["_id"], e["data"]["prediction"]) for e in edb.get_analysis_timeseries_db().find({"metadata.key": "inference/labels"},{"data.prediction": 1, "_id": 1})])
print(len(label_predictions_list), label_predictions_list[0:10])
print("_" * 10, "inferred trips", "_" * 10)
inferred_predictions_list = inferred_ebike_ids([(e["_id"], e["data"]["inferred_labels"]) for e in edb.get_analysis_timeseries_db().find({"metadata.key": "analysis/inferred_trip"},{"data.inferred_labels": 1, "_id": 1})])
print(len(inferred_predictions_list), inferred_predictions_list[0:10])
print("_" * 10, "expected trips", "_" * 10)
expected_predictions_list = inferred_ebike_ids([(e["_id"], e["data"]["inferred_labels"]) for e in edb.get_analysis_timeseries_db().find({"metadata.key": "analysis/expected_trip"},{"data.inferred_labels": 1, "_id": 1})])
print(len(expected_predictions_list), expected_predictions_list[0:10])
print("_" * 10, "confirmed trips", "_" * 10)
confirmed_trips_list = inferred_ebike_ids([(e["_id"], e["data"]["inferred_labels"]) for e in edb.get_analysis_timeseries_db().find({"metadata.key": "analysis/confirmed_trip"},{"data.inferred_labels": 1, "_id": 1}) if "inferred_labels" in e["data"]])
print(len(confirmed_trips_list), confirmed_trips_list[0:10])
                                                                                        # print([e for e in edb.get_analysis_timeseries_db().find({"metadata.key": "analysis/confirmed_trip"}) if "inferred_labels" not in e["data"]])
