class ObservationSerializer
  include FastJsonapi::ObjectSerializer
  belongs_to :county
  belongs_to :organism
  attributes :id, :date, :inat, :lat, :lon
end
