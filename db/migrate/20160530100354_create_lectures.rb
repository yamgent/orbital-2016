class CreateLectures < ActiveRecord::Migration
  def change
    create_table :lectures do |t|

      t.integer :day
      t.time :start_time
      t.time :end_time

      t.timestamps null: false
    end
  end
end
