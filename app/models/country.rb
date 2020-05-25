class Country < ApplicationRecord
  has_many :states
  has_many :counties, through: :states
end
